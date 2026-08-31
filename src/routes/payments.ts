import { Router } from 'express';
import { initiatePayment, mpesaCallback, getPaymentStatus } from '../controllers/payments';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Protected: Cashier / Admin / Manager can trigger M-Pesa STK Push
router.post('/checkout', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER, Role.CUSTOMER]), initiatePayment);

// Polling status for UI feedback
router.get('/status/:checkoutRequestId', getPaymentStatus);

// Public: Safaricom Daraja Webhook
router.post('/callback', mpesaCallback);

export default router;