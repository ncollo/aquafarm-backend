import { Router } from 'express';
import { register, login, getCurrentUser, forgotPassword, resetPassword } from '../controllers/auth';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, getCurrentUser);

export default router;