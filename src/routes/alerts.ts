import { Router } from 'express';
import { getAlerts, markAlertAsRead, triggerAlertScan } from '../controllers/alerts';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Allow authenticated Admin and Manager to view alerts and mark as read
router.get('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), getAlerts);
router.patch('/:id/read', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), markAlertAsRead);
router.post('/scan', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), triggerAlertScan);

export default router;
