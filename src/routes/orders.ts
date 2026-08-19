import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orders';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', createOrder);

router.get('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), getOrders);
router.get('/:id', verifyToken, getOrders);
router.patch('/:id/status', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), updateOrderStatus);

export default router;