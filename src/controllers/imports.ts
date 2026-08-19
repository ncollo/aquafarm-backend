import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { extractTextFromFile } from '../services/documentParser';
import { parseProductsFromText } from '../services/dataExtractor';
import { ProductStatus } from '@prisma/client';

export const handleBulkImport = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Please upload a .pdf or .docx file' });
      return;
    }

    // 1. Extract raw text from the file buffer
    const rawText = await extractTextFromFile(req.file.buffer, req.file.originalname);

    // 2. Parse the text into structured product objects
    const parsedItems = parseProductsFromText(rawText);

    if (parsedItems.length === 0) {
      res.status(400).json({ error: 'No valid products found in the document. Please check the formatting.' });
      return;
    }

    let itemsAdded = 0;
    let itemsUpdated = 0;

    // 3. Upsert into the database (Update if exists, Create if new)
    for (const item of parsedItems) {
      const existingProduct = await prisma.product.findFirst({
        where: { name: { equals: item.name, mode: 'insensitive' } }
      });

      if (existingProduct) {
        // Add new stock to existing stock
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            stock: existingProduct.stock + item.stock,
            price: item.price, // Update to latest supplier price
            status: existingProduct.imageUrl ? ProductStatus.AVAILABLE : ProductStatus.PENDING_IMAGE
          }
        });
        itemsUpdated++;
      } else {
        // Create new product
        await prisma.product.create({
          data: {
            name: item.name,
            category: item.category,
            stock: item.stock,
            unit: item.unit,
            price: item.price,
            status: ProductStatus.PENDING_IMAGE // No image uploaded yet
          }
        });
        itemsAdded++;
      }
    }

    res.status(200).json({
      message: 'Bulk import successful',
      results: {
        totalFound: parsedItems.length,
        newItemsAdded: itemsAdded,
        existingItemsUpdated: itemsUpdated
      }
    });

  } catch (error: any) {
    console.error('Bulk Import Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process import document' });
  }
};