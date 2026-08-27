import { Router } from 'express';
import {
  generateSalesReport,
  generateStockReport,
  generateFinancialReport,
  generateWaterQualityReport,
  generateFullFarmExport
} from '../controllers/reports';

const router = Router();

router.get('/sales/pdf', generateSalesReport);
router.get('/stock/pdf', generateStockReport);
router.get('/financial/pdf', generateFinancialReport);
router.get('/water-quality/pdf', generateWaterQualityReport);
router.get('/export-all/pdf', generateFullFarmExport);

export default router;
