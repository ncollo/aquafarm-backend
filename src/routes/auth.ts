import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth';
import { verifyToken } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getCurrentUser);

export default router;