import { Request, Response } from 'express';
import prisma from '../config/prisma';
import AlertScannerService from '../services/alertScanner';

export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { isRead: false },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 20,
    });

    res.status(200).json(alerts);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch active alerts' });
  }
};

export const markAlertAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updated = await prisma.alert.update({
      where: { id: String(id) },
      data: { isRead: true },
    });

    res.status(200).json(updated);
  } catch (error: any) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ error: 'Failed to mark alert as read' });
  }
};

export const triggerAlertScan = async (req: Request, res: Response): Promise<void> => {
  try {
    await AlertScannerService.runScan();
    const alerts = await prisma.alert.findMany({
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ message: 'Scan executed successfully', count: alerts.length, alerts });
  } catch (error: any) {
    console.error('Error executing manual alert scan:', error);
    res.status(500).json({ error: 'Failed to run alert scan' });
  }
};
