import { Router } from 'express';
import { getOverviewAnalytics } from '../controllers/analytics';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Admin and Manager can view overview analytics
router.get('/overview', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), getOverviewAnalytics);

export default router;
