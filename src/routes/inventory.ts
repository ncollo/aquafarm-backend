import { Router } from 'express';
import { getInventory, createBatch, updateBatch } from '../controllers/inventory';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public/Customer access to view available stock
router.get('/', getInventory);

// Protected routes: Only Admin and Manager can modify stock
router.post('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), createBatch);
router.put('/:id', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), updateBatch);

export default router;