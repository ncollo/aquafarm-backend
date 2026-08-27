import { Router } from 'express';
import { 
  getFishBatches, 
  createFishBatch, 
  deleteFishBatch,
  getPonds
} from '../controllers/stock';

const router = Router();

router.get('/batches', getFishBatches);
router.post('/batches', createFishBatch);
router.delete('/batches/:id', deleteFishBatch);

router.get('/ponds', getPonds);

export default router;