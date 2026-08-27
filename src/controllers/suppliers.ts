import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getSuppliers = async (req: Request, res: Response): Promise<void> => {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { isActive: true },
      include: {
        fishBatches: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = suppliers.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      contact: s.contactPhone,
      contactPhone: s.contactPhone,
      lastOrder: s.fishBatches.length > 0 
        ? s.fishBatches[0].createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : s.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      outstanding: `KES ${s.outstandingDebt.toLocaleString()}`,
      outstandingDebt: s.outstandingDebt,
      status: s.isActive ? "Active" : "Inactive",
      rating: s.rating,
      batchesCount: s.fishBatches.length
    }));

    res.status(200).json(formatted);
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

export const createSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, contactPhone, outstandingDebt, rating } = req.body;

    if (!name || !category || !contactPhone) {
      res.status(400).json({ error: 'Name, category, and contact phone are required' });
      return;
    }

    const newSupplier = await prisma.supplier.create({
      data: {
        name,
        category,
        contactPhone,
        outstandingDebt: outstandingDebt !== undefined ? parseFloat(outstandingDebt) : 0,
        rating: rating !== undefined ? parseInt(rating, 10) : 5,
        isActive: true
      }
    });

    res.status(201).json(newSupplier);
  } catch (error: any) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: error.message || 'Failed to create supplier' });
  }
};

export const updateSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, category, contactPhone, outstandingDebt, rating, isActive } = req.body;

    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        category: category !== undefined ? category : undefined,
        contactPhone: contactPhone !== undefined ? contactPhone : undefined,
        outstandingDebt: outstandingDebt !== undefined ? parseFloat(outstandingDebt) : undefined,
        rating: rating !== undefined ? parseInt(rating, 10) : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined
      }
    });

    res.status(200).json(updated);
  } catch (error: any) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: error.message || 'Failed to update supplier' });
  }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    // Check if supplier has linked fish batches
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { fishBatches: true }
    });

    if (!supplier) {
      res.status(404).json({ error: 'Supplier not found' });
      return;
    }

    if (supplier.fishBatches.length > 0) {
      // Soft-delete if historical fish batches are linked
      await prisma.supplier.update({
        where: { id },
        data: { isActive: false }
      });
    } else {
      // Hard delete if no relations
      await prisma.supplier.delete({
        where: { id }
      });
    }

    res.status(200).json({ message: 'Supplier deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: error.message || 'Failed to delete supplier' });
  }
};
