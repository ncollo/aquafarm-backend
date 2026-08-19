import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products';
import { uploadSingleImage } from '../middlewares/upload';

const router = Router();


router.get('/', getProducts);
router.get('/:id', getProductById);


router.post('/', uploadSingleImage, createProduct);
router.put('/:id', uploadSingleImage, updateProduct);
router.delete('/:id', deleteProduct);

export default router;