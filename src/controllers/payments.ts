import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { initiateStkPush } from '../services/mpesa';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import { generateReceiptPDF } from '../services/pdfGenerator';
import { sendReceiptEmail } from '../services/emailService';

// 1. Trigger the STK Push
export const initiatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, phoneNumber } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: String(orderId) },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const mpesaResponse = await initiateStkPush(phoneNumber, order.totalAmount, order.id);
    const checkoutRequestId = mpesaResponse.CheckoutRequestID;

    await prisma.payment.create({
      data: {
        amount: order.totalAmount,
        checkoutRequestId,
        phoneNumber,
        orderId: order.id,
        status: PaymentStatus.PENDING,
      },
    });

    res.status(200).json({ message: 'STK Push initiated', checkoutRequestId });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message || 'Payment initiation failed' });
  }
};

// 2. Receive the Webhook Callback from Safaricom
export const mpesaCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('M-Pesa Webhook hit:', JSON.stringify(req.body, null, 2));

    const callbackData = req.body.Body?.stkCallback;
    if (!callbackData) {
      res.status(400).json({ error: 'Invalid callback data' });
      return;
    }

    const checkoutRequestId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode;

    // Find the payment record and related order/items/product
    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId: String(checkoutRequestId) },
      include: {
        order: {
          include: {
            items: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!payment || !payment.order) {
      console.error(`Payment/Order record not found for CheckoutRequestID: ${checkoutRequestId}`);
      res.status(404).json({ error: 'Payment record not found' });
      return;
    }

    if (resultCode === 0) {
      // --- PAYMENT SUCCESSFUL ---
      const callbackMetadata = callbackData.CallbackMetadata?.Item;
      const receipt = callbackMetadata?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

      // Update payment, order status, and reconcile product stock atomically
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { checkoutRequestId: String(checkoutRequestId) },
          data: {
            status: PaymentStatus.SUCCESS,
            mpesaReceipt: String(receipt),
            paymentDate: new Date(),
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.PROCESSING },
        });

        // Deduct inventory for all products in the order
        for (const item of payment.order.items) {
          const updatedProduct = await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          // Automatically mark out of stock if stock drops to 0 or below
          if (updatedProduct.stock <= 0) {
            await tx.product.update({
              where: { id: item.productId },
              data: { status: 'OUT_OF_STOCK' },
            });
          }
        }
      });

      console.log(`Payment successful for Order ${payment.order.orderNumber}.`);

      // Dispatch PDF receipt asynchronously
      const order = payment.order;
      if (order.customerEmail) {
        try {
          const pdfBuffer = await generateReceiptPDF(order as any, String(receipt));
          await sendReceiptEmail(
            order.customerEmail,
            order.customerName || 'Customer',
            order.orderNumber,
            pdfBuffer
          );
        } catch (emailError) {
          console.error('Failed to generate/send receipt:', emailError);
        }
      }
    } else {
      // --- PAYMENT FAILED / CANCELLED ---
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { checkoutRequestId: String(checkoutRequestId) },
          data: { status: PaymentStatus.FAILED },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.CANCELLED },
        });
      });
    }

    res.status(200).json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('M-Pesa Callback Error:', error);
    res.status(500).json({ error: 'Internal server error processing callback' });
  }
};