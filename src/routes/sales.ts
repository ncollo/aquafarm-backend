import { Router } from 'express';
import { getSalesRecords, createSale } from '../controllers/sales';

const router = Router();

router.get('/', getSalesRecords);
router.post('/', createSale);

export default router;