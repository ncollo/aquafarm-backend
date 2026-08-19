import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { OrderStatus } from '@prisma/client';

// 1. Create Order (Guest or Authenticated)
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderType, deliveryAddress, customerName, customerEmail, customerPhone, items } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Order must contain at least one item' });
      return;
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const productId = item.productId || item.batchId;
      const quantity = Number(item.quantity || item.quantityKg || 1);

      const product = await prisma.product.findUnique({
        where: { id: String(productId) },
      });

      if (!product) {
        res.status(404).json({ error: `Product not found: ${productId}` });
        return;
      }

      if (product.stock < quantity) {
        res.status(400).json({ error: `Insufficient stock for ${product.name}` });
        return;
      }

      const subtotal = product.price * quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        productId: product.id,
        quantity,
        subtotal,
      });
    }

    // Generate readable Order Number (e.g. AQF-2026-0001)
    const orderCount = await prisma.order.count();
    const orderNumber = `AQF-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        orderType: orderType || 'RETAIL',
        totalAmount,
        deliveryAddress: deliveryAddress || 'Store Pickup',
        customerName: customerName || 'Guest Customer',
        customerEmail: customerEmail || null,
        customerPhone: customerPhone || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error('Create Order Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
};

// 2. Get All Orders (For Admin / Order Tracking)
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const whereClause: any = {};
    if (status) {
      whereClause.status = status as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: { product: true },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(orders);
  } catch (error: any) {
    console.error('Get Orders Error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// 3. Update Order Status (For Admin Dashboard)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: String(id) },
      data: { status: status as OrderStatus },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.status(200).json(order);
  } catch (error: any) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};