import { Router } from 'express';
import { getAuditLogs, createAuditLog } from '../controllers/audit';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Only ADMIN can view full audit history
router.get('/', verifyToken, requireRoles([Role.ADMIN]), getAuditLogs);

// ADMIN and MANAGER actions can be logged
router.post('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), createAuditLog);

export default router;
