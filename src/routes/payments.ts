import { Router } from 'express';
import { initiatePayment, mpesaCallback } from '../controllers/payments';
import { verifyToken } from '../middlewares/auth';

const router = Router();

// Protected: Only logged-in users can initiate a payment for their order
router.post('/checkout', verifyToken, initiatePayment);

// Public: Safaricom Daraja Webhook
router.post('/callback', mpesaCallback);

export default router;