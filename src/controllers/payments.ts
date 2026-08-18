import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';
import { initiateStkPush } from '../services/mpesa';
import { PaymentStatus, OrderStatus } from '@prisma/client';

// 1. Trigger the STK Push
export const initiatePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderId, phoneNumber } = req.body;

    // Verify order exists
    const order = await prisma.order.findUnique({ where: { id: String(orderId) } });
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // Trigger STK Push via our M-Pesa service
    const mpesaResponse = await initiateStkPush(phoneNumber, order.totalAmount, order.id);

    // mpesaResponse.CheckoutRequestID is crucial for tracking the transaction
    const checkoutRequestId = mpesaResponse.CheckoutRequestID;

    // Save pending payment in the database
    await prisma.payment.create({
      data: {
        amount: order.totalAmount,
        checkoutRequestId,
        phoneNumber,
        orderId: order.id,
        status: PaymentStatus.PENDING,
      }
    });

    res.status(200).json({ message: 'STK Push initiated', checkoutRequestId });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Payment initiation failed' });
  }
};

// 2. Receive the Webhook Callback from Safaricom
export const mpesaCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const callbackData = req.body.Body.stkCallback;
    const checkoutRequestId = callbackData.CheckoutRequestID;
    const resultCode = callbackData.ResultCode; 

    if (resultCode === 0) {
      // ResultCode 0 means the user successfully paid
      const callbackMetadata = callbackData.CallbackMetadata.Item;
      const receipt = callbackMetadata.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
      
      // Update Payment and Order statuses atomically
      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
          where: { checkoutRequestId },
          data: {
            status: PaymentStatus.SUCCESS,
            mpesaReceipt: String(receipt),
            paymentDate: new Date()
          }
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: OrderStatus.PROCESSING } // Move order forward
        });
      });

    } else {
      // Failed, cancelled by user, or insufficient funds
      await prisma.payment.update({
        where: { checkoutRequestId },
        data: { status: PaymentStatus.FAILED }
      });
    }

    // You MUST return a 200 OK to Safaricom, otherwise they will keep retrying the callback
    res.status(200).json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('M-Pesa Callback Error:', error);
    res.status(500).json({ error: 'Internal server error processing callback' });
  }
};