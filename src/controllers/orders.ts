import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';
import { OrderStatus, Role } from '@prisma/client';

// Generate a random order number like SAL-2026-1234
const generateOrderNumber = () => `SAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { items, orderType, deliveryAddress } = req.body;
        const userId = req.user!.id; // Extracted from the JWT

        if (!items || items.length === 0) {
            res.status(400).json({ error: 'Order must contain at least one item' });
            return;
        }

        // Use a Prisma transaction to ensure atomic operations
        const order = await prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const orderItemsData: { batchId: string; quantityKg: number; subtotal: number }[] = [];

            for (const item of items) {
                const batch = await tx.fishBatch.findUnique({ where: { id: item.batchId } });

                if (!batch) throw new Error(`Batch not found: ${item.batchId}`);
                if (batch.totalKg < item.quantityKg) throw new Error(`Insufficient stock for batch ${batch.batchCode}`);

                const subtotal = batch.pricePerKg * item.quantityKg;
                totalAmount += subtotal;

                // Deduct inventory
                await tx.fishBatch.update({
                    where: { id: batch.id },
                    data: { totalKg: batch.totalKg - item.quantityKg }
                });

                orderItemsData.push({
                    batchId: batch.id,
                    quantityKg: item.quantityKg,
                    subtotal
                });
            }

            // Create the final order
            return tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    orderType: orderType || 'RETAIL',
                    totalAmount,
                    deliveryAddress,
                    userId,
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: true }
            });
        });

        res.status(201).json(order);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || 'Failed to create order' });
    }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { role, id } = req.user!;

        const orders = await prisma.order.findMany({
            where: (role === Role.ADMIN || role === Role.MANAGER) ? undefined : { userId: id },
            include: {
                user: { select: { name: true, email: true, phone: true } },
                items: { include: { batch: { select: { species: true, batchCode: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the enum
    if (!Object.values(OrderStatus).includes(status)) {
      res.status(400).json({ error: 'Invalid order status' });
      return;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: String(id) },
      data: { status }
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};