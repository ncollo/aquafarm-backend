import { Request, Response } from 'express';
import prisma from '../config/prisma';


export const getFishBatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const batches = await prisma.fishBatch.findMany({
      include: {
        ponds: true, 
        supplier: true
      },
      orderBy: { createdAt: 'desc' }
    });

    
    const formattedBatches = batches.map(batch => {
      
      let daysToHarvest = null;
      if (batch.expectedHarvest) {
        const diffTime = new Date(batch.expectedHarvest).getTime() - new Date().getTime();
        daysToHarvest = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        id: batch.id,
        batchCode: batch.batchCode,
        species: batch.species,
        pondCount: batch.ponds.length, 
        totalKg: batch.totalKg,
        avgWeight: batch.avgWeight,
        healthStatus: batch.healthStatus,
        daysToHarvest: daysToHarvest && daysToHarvest > 0 ? daysToHarvest : null,
      };
    });

    res.status(200).json(formattedBatches);
  } catch (error: any) {
    console.error('Error fetching fish batches:', error);
    res.status(500).json({ error: 'Failed to fetch fish stock' });
  }
};

export const createFishBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { batchCode, species, totalKg, avgWeight, healthStatus, expectedHarvest, pricePerKg } = req.body;

    const newBatch = await prisma.fishBatch.create({
      data: {
        batchCode,
        species,
        totalKg: parseFloat(totalKg),
        avgWeight,
        healthStatus: healthStatus || 'GOOD',
        expectedHarvest: expectedHarvest ? new Date(expectedHarvest) : null,
        pricePerKg: parseFloat(pricePerKg || '0')
      }
    });

    res.status(201).json(newBatch);
  } catch (error: any) {
    console.error('Error creating batch:', error);
    res.status(500).json({ error: 'Failed to create fish batch' });
  }
};

export const deleteFishBatch = async (req: Request, res: Response): Promise<void> => {
  try {
    
    const id = req.params.id as string;
    
    await prisma.fishBatch.delete({ where: { id } });
    
    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ error: 'Failed to delete fish batch' });
  }
};

export const getPonds = async (req: Request, res: Response): Promise<void> => {
  try {
    const ponds = await prisma.pond.findMany({
      include: { currentBatch: true }
    });
    res.status(200).json(ponds);
  } catch (error: any) {
    console.error('Error fetching ponds:', error);
    res.status(500).json({ error: 'Failed to fetch ponds' });
  }
};