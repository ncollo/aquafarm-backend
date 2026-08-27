import { Router } from 'express';
import { getSalesRecords, createSale, updateSaleStatus, deleteSale } from '../controllers/sales';

const router = Router();

router.get('/', getSalesRecords);
router.post('/', createSale);
router.put('/:id', updateSaleStatus);
router.delete('/:id', deleteSale);

export default router;