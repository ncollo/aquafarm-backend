import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orders';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// All order routes require authentication
router.use(verifyToken);

router.post('/', createOrder);
router.get('/', getOrders);

// Only staff can update fulfillment statuses
router.patch('/:id/status', requireRoles([Role.ADMIN, Role.MANAGER]), updateOrderStatus);

export default router;