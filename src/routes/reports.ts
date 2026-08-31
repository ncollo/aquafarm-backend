import { Router } from 'express';
import {
  generateSalesReport,
  generateStockReport,
  generateFinancialReport,
  generateWaterQualityReport,
  generateFullFarmExport
} from '../controllers/reports';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Operational reports accessible to both ADMIN and MANAGER
router.get('/stock/pdf', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), generateStockReport);
router.get('/water-quality/pdf', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), generateWaterQualityReport);

// Sensitive financial and full farm audit exports restricted to ADMIN only
router.get('/sales/pdf', verifyToken, requireRoles([Role.ADMIN]), generateSalesReport);
router.get('/financial/pdf', verifyToken, requireRoles([Role.ADMIN]), generateFinancialReport);
router.get('/export-all/pdf', verifyToken, requireRoles([Role.ADMIN]), generateFullFarmExport);

export default router;
