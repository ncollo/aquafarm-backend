import { Router } from 'express';
import { getOverviewAnalytics } from '../controllers/analytics';

const router = Router();

router.get('/overview', getOverviewAnalytics);

export default router;
