import { Router } from 'express';
import { initiatePayment, mpesaCallback } from '../controllers/payments';


const router = Router();

// Protected: Only logged-in users can initiate a payment for their order
router.post('/checkout', initiatePayment);

// Public: Safaricom Daraja Webhook
router.post('/callback', mpesaCallback);

export default router;