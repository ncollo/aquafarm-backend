import { Router } from 'express';
import { getFishBatches, createFishBatch, deleteFishBatch } from '../controllers/stock';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public / Internal stock view
router.get('/batches', getFishBatches);

// Adding batches is available to ADMIN and MANAGER
router.post('/batches', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), createFishBatch);

// Deleting fish batches permanently is restricted to ADMIN
router.delete('/batches/:id', verifyToken, requireRoles([Role.ADMIN]), deleteFishBatch);

export default router;