import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getSalesRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

   
    const formattedSales = orders.map(order => {
      
      const primaryItem = order.items[0]; 
      
      return {
        id: order.orderNumber,
        date: order.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        customer: order.customerName || 'Walk-in Customer',
        type: order.orderType,
        species: primaryItem ? primaryItem.product.name : 'Multiple Items',
        qty: primaryItem ? `${primaryItem.quantity} ${primaryItem.product.unit}` : '-',
        amount: `KES ${order.totalAmount.toLocaleString()}`,
        status: order.status,
      };
    });

    res.status(200).json(formattedSales);
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales records' });
  }
};

export const createSale = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerName, orderType, items } = req.body;
    
    const newOrder = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) throw new Error(`Product not found.`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
        }

        totalAmount += (item.quantity * item.price);

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity }
        });
      }

      
      const orderNumber = `SAL-${Math.floor(Date.now() / 1000).toString().slice(-7)}`;

      return await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName || 'Walk-in Customer',
          orderType: orderType || 'RETAIL',
          totalAmount,
          status: 'COMPLETED', 
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              subtotal: item.quantity * item.price
            }))
          }
        },
        include: { items: true }
      });
    });

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error('Transaction Error:', error);
    res.status(400).json({ error: error.message || 'Failed to process sale' });
  }
};