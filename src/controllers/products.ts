import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { uploadImageToImageKit } from '../services/uploadService';
import { ProductStatus } from '@prisma/client';

// 1. Get all products (supports filtering for store or admin view)
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, inStockOnly } = req.query;

    const whereClause: any = {};
    if (category && category !== 'all') {
      whereClause.category = String(category);
    }
    if (status) {
      whereClause.status = status as ProductStatus;
    }
    if (inStockOnly === 'true') {
      whereClause.stock = { gt: 0 };
      whereClause.status = ProductStatus.AVAILABLE;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// 2. Get single product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: String(id) } });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// 3. Create a new product (with optional ImageKit upload)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, description, price, unit, stock } = req.body;

    const parsedPrice = parseFloat(price);
    const parsedStock = parseFloat(stock);

    if (!name || isNaN(parsedPrice) || isNaN(parsedStock) || !unit || !category) {
      res.status(400).json({ error: 'Please provide all required fields (name, category, price, unit, stock)' });
      return;
    }

    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = await uploadImageToImageKit(req.file.buffer, req.file.originalname, '/products');
    }

    // Determine status automatically
    let status: ProductStatus = ProductStatus.AVAILABLE;
    if (!imageUrl) {
      status = ProductStatus.PENDING_IMAGE;
    } else if (parsedStock <= 0) {
      status = ProductStatus.OUT_OF_STOCK;
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description: description || null,
        price: parsedPrice,
        unit,
        stock: parsedStock,
        imageUrl,
        status,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
};

// 4. Update an existing product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, description, price, unit, stock, imageUrl: existingImageUrl } = req.body;

    const existingProduct = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    let finalImageUrl = existingProduct.imageUrl;

    // If a new image file was uploaded, pipe to ImageKit
    if (req.file) {
      finalImageUrl = await uploadImageToImageKit(req.file.buffer, req.file.originalname, '/products');
    } else if (existingImageUrl !== undefined) {
      finalImageUrl = existingImageUrl;
    }

    const parsedStock = stock !== undefined ? parseFloat(stock) : existingProduct.stock;
    const parsedPrice = price !== undefined ? parseFloat(price) : existingProduct.price;

    // Automatic status recalculation
    let status: ProductStatus = ProductStatus.AVAILABLE;
    if (!finalImageUrl) {
      status = ProductStatus.PENDING_IMAGE;
    } else if (parsedStock <= 0) {
      status = ProductStatus.OUT_OF_STOCK;
    }

    const updated = await prisma.product.update({
      where: { id: String(id) },
      data: {
        name: name ?? existingProduct.name,
        category: category ?? existingProduct.category,
        description: description !== undefined ? description : existingProduct.description,
        price: parsedPrice,
        unit: unit ?? existingProduct.unit,
        stock: parsedStock,
        imageUrl: finalImageUrl,
        status,
      },
    });

    res.status(200).json(updated);
  } catch (error: any) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
};

// 5. Delete a product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await prisma.product.delete({ where: { id: String(id) } });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};