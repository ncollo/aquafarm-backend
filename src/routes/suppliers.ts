import { Router } from 'express';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../controllers/suppliers';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Viewing, adding, and updating suppliers is accessible to ADMIN and MANAGER
router.get('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), getSuppliers);
router.post('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), createSupplier);
router.put('/:id', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), updateSupplier);

// Deleting suppliers is restricted to ADMIN only
router.delete('/:id', verifyToken, requireRoles([Role.ADMIN]), deleteSupplier);

export default router;
