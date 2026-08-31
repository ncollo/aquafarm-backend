import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';

export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.status(200).json(logs);
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

export const createAuditLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { action, details } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User identity not found' });
      return;
    }

    if (!action) {
      res.status(400).json({ error: 'Action is required for audit logging' });
      return;
    }

    const log = await prisma.auditLog.create({
      data: {
        action,
        details: typeof details === 'object' ? JSON.stringify(details) : details,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    res.status(201).json(log);
  } catch (error: any) {
    console.error('Error creating audit log:', error);
    res.status(500).json({ error: 'Failed to record audit log' });
  }
};
