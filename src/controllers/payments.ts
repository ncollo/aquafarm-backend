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

    if (!orderId || !phoneNumber) {
      res.status(400).json({ error: 'Order ID and Phone Number are required' });
      return;
    }

    // Find order by ID or orderNumber
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: String(orderId) },
          { orderNumber: String(orderId) },
        ],
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const mpesaResponse = await initiateStkPush(phoneNumber, order.totalAmount, order.orderNumber || order.id);
    const checkoutRequestId = mpesaResponse.CheckoutRequestID;

    // Check if payment entry exists for this order
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: order.id },
    });

    if (existingPayment) {
      await prisma.payment.update({
        where: { orderId: order.id },
        data: {
          amount: order.totalAmount,
          checkoutRequestId,
          phoneNumber,
          status: PaymentStatus.PENDING,
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          amount: order.totalAmount,
          checkoutRequestId,
          phoneNumber,
          orderId: order.id,
          status: PaymentStatus.PENDING,
        },
      });
    }

    res.status(200).json({
      message: 'STK Push initiated successfully',
      checkoutRequestId,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message || 'Payment initiation failed' });
  }
};

// 2. Receive the Webhook Callback from Safaricom with Immediate 200 OK ACK & Idempotent Processing
export const mpesaCallback = async (req: Request, res: Response): Promise<void> => {
  // Acknowledge immediately with 200 OK to prevent Safaricom retry loops
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  // Process webhook payload asynchronously
  setImmediate(async () => {
    try {
      console.log('M-Pesa Webhook Payload:', JSON.stringify(req.body, null, 2));

      const callbackData = req.body.Body?.stkCallback;
      if (!callbackData) {
        console.warn('Invalid callback payload received:', req.body);
        return;
      }

      const checkoutRequestId = String(callbackData.CheckoutRequestID);
      const resultCode = callbackData.ResultCode;

      const payment = await prisma.payment.findUnique({
        where: { checkoutRequestId },
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
        console.error(`Payment record not found for CheckoutRequestID: ${checkoutRequestId}`);
        return;
      }

      // Idempotency check: if already SUCCESS, do not duplicate actions
      if (payment.status === PaymentStatus.SUCCESS) {
        console.log(`Payment for ${checkoutRequestId} is already processed. Skipping duplicate callback.`);
        return;
      }

      if (resultCode === 0) {
        // --- PAYMENT SUCCESSFUL ---
        const callbackMetadata = callbackData.CallbackMetadata?.Item;
        const receipt = callbackMetadata?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value || `MPESA-${Date.now()}`;

        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { checkoutRequestId },
            data: {
              status: PaymentStatus.SUCCESS,
              mpesaReceipt: String(receipt),
              paymentDate: new Date(),
            },
          });

          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: OrderStatus.COMPLETED },
          });

          // Stock reconciliation
          for (const item of payment.order.items) {
            const currentProd = await tx.product.findUnique({ where: { id: item.productId } });
            if (currentProd) {
              const newStock = Math.max(0, currentProd.stock - item.quantity);
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: newStock,
                  status: newStock <= 0 ? 'OUT_OF_STOCK' : currentProd.status,
                },
              });
            }
          }
        });

        console.log(`Payment confirmed: Receipt ${receipt} for Order ${payment.order.orderNumber}`);

        // Asynchronously dispatch PDF receipt if customer email is present
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
            console.error('Failed to send receipt email:', emailError);
          }
        }
      } else {
        // --- PAYMENT FAILED / CANCELLED ---
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { checkoutRequestId },
            data: { status: PaymentStatus.FAILED },
          });

          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: OrderStatus.CANCELLED },
          });
        });
        console.warn(`Payment failed for CheckoutRequestID ${checkoutRequestId}, ResultCode: ${resultCode}`);
      }
    } catch (error) {
      console.error('Asynchronous M-Pesa Callback Error:', error);
    }
  });
};

// 3. Query Payment Status for Live Polling
export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { checkoutRequestId } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { checkoutRequestId: String(checkoutRequestId) },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            customerName: true,
          },
        },
      },
    });

    if (!payment) {
      res.status(404).json({ error: 'Payment request not found' });
      return;
    }

    res.status(200).json({
      status: payment.status,
      checkoutRequestId: payment.checkoutRequestId,
      mpesaReceipt: payment.mpesaReceipt,
      amount: payment.amount,
      phoneNumber: payment.phoneNumber,
      order: payment.order,
    });
  } catch (error: any) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
};