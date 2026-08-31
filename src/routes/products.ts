import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products';
import { uploadSingleImage } from '../middlewares/upload';
import { verifyToken, requireRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

// Public storefront catalog
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin & Manager can add or update inventory products
router.post('/', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), uploadSingleImage, createProduct);
router.put('/:id', verifyToken, requireRoles([Role.ADMIN, Role.MANAGER]), uploadSingleImage, updateProduct);

// Only Admin can delete products
router.delete('/:id', verifyToken, requireRoles([Role.ADMIN]), deleteProduct);

export default router;