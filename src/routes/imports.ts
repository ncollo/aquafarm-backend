import { Router } from 'express';
import { handleBulkImport } from '../controllers/imports';
import multer from 'multer';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for documents
});

// POST /api/imports/bulk
router.post('/bulk', upload.single('document'), handleBulkImport);

export default router;