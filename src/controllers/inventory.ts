import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Get all fish batches
export const getInventory = async (req: Request, res: Response): Promise<void> => {
  try {
    const batches = await prisma.fishBatch.findMany({
      include: { supplier: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(batches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

// Create a new fish batch (Admin/Manager only)
export const createBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchCode, species, totalKg, avgWeight, expectedHarvest, pricePerKg, supplierId, healthStatus } = req.body;

    const existingBatch = await prisma.fishBatch.findUnique({ where: { batchCode } });
    if (existingBatch) {
      res.status(400).json({ error: 'Batch code already exists' });
      return;
    }

    const newBatch = await prisma.fishBatch.create({
      data: {
        batchCode,
        species,
        totalKg: Number(totalKg),
        avgWeight,
        healthStatus: healthStatus || 'GOOD',
        expectedHarvest: expectedHarvest ? new Date(expectedHarvest) : null,
        pricePerKg: Number(pricePerKg || 0),
        supplierId
      }
    });

    res.status(201).json(newBatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create fish batch' });
  }
};

export const updateBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { totalKg, avgWeight, healthStatus } = req.body;

    const updatedBatch = await prisma.fishBatch.update({
      where: { id: String(id) },
      data: { 
        totalKg: totalKg !== undefined ? Number(totalKg) : undefined, 
        avgWeight: avgWeight !== undefined ? String(avgWeight) : undefined, 
        healthStatus: healthStatus !== undefined ? healthStatus : undefined 
      }
    });

    res.status(200).json(updatedBatch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update batch' });
  }
};