import { Router } from 'express';
import { getSalesRecords, createSale, updateSaleStatus, deleteSale } from '../controllers/sales';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Viewing, logging, and updating sales is accessible to ADMIN and MANAGER
router.get('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), getSalesRecords);
router.post('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), createSale);
router.put('/:id', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), updateSaleStatus);

// Deleting a sale permanently and restoring stock is restricted to ADMIN
router.delete('/:id', verifyToken, requireRoles([Role.ADMIN]), deleteSale);

export default router;