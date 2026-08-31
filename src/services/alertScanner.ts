import cron from 'node-cron';
import prisma from '../config/prisma';
import { AlertPriority } from '@prisma/client';

export class AlertScannerService {
  private static isRunning = false;

  /**
   * Performs an isolated asynchronous scan of farm telemetry and operations
   */
  public static async runScan(): Promise<void> {
    if (this.isRunning) {
      console.log('[AlertScanner] Previous scan cycle still in progress. Skipping.');
      return;
    }

    this.isRunning = true;

    try {
      await Promise.allSettled([
        this.scanPondTelemetry(),
        this.scanFishBatches(),
        this.scanSupplierDebts(),
        this.scanPendingOrders(),
      ]);
    } catch (error) {
      console.error('[AlertScanner] Unexpected error in scan cycle:', error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Scans Ponds for critical water quality thresholds
   */
  private static async scanPondTelemetry(): Promise<void> {
    try {
      const ponds = await prisma.pond.findMany({
        where: { status: 'ACTIVE' },
      });

      for (const pond of ponds) {
        // Dissolved Oxygen check (< 6.0 mg/L is dangerous for tilapia/trout)
        if (pond.dissolvedOxygen !== null && pond.dissolvedOxygen < 6.0) {
          const priority = pond.dissolvedOxygen < 4.5 ? AlertPriority.CRITICAL : AlertPriority.HIGH;
          await this.createAlertIfNotExists(
            `${pond.name}: Low dissolved oxygen (${pond.dissolvedOxygen} mg/L). Immediate aeration required!`,
            'warning',
            priority
          );
        }

        // pH Level check (acceptable range: 6.5 - 8.5)
        if (pond.phLevel !== null && (pond.phLevel < 6.5 || pond.phLevel > 8.5)) {
          await this.createAlertIfNotExists(
            `${pond.name}: Water pH is ${pond.phLevel} (outside optimal 6.5 - 8.5 range).`,
            'warning',
            AlertPriority.HIGH
          );
        }

        // Temperature check (> 29°C or < 18°C)
        if (pond.temperature !== null && (pond.temperature > 29 || pond.temperature < 18)) {
          await this.createAlertIfNotExists(
            `${pond.name}: Water temperature reading ${pond.temperature}°C requires monitoring.`,
            'info',
            AlertPriority.MEDIUM
          );
        }
      }
    } catch (error) {
      console.error('[AlertScanner] Error scanning pond telemetry:', error);
    }
  }

  /**
   * Scans Fish Batches approaching expected harvest (within 3 days)
   */
  private static async scanFishBatches(): Promise<void> {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      const batches = await prisma.fishBatch.findMany({
        where: {
          expectedHarvest: {
            lte: threeDaysFromNow,
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Within the last week or upcoming 3 days
          },
        },
      });

      for (const batch of batches) {
        await this.createAlertIfNotExists(
          `Fish Batch ${batch.batchCode} (${batch.species}) is ready for scheduled harvest.`,
          'info',
          AlertPriority.MEDIUM
        );
      }
    } catch (error) {
      console.error('[AlertScanner] Error scanning fish batches:', error);
    }
  }

  /**
   * Scans Suppliers with high outstanding balances
   */
  private static async scanSupplierDebts(): Promise<void> {
    try {
      const suppliers = await prisma.supplier.findMany({
        where: {
          outstandingDebt: { gt: 50000 },
        },
      });

      for (const supplier of suppliers) {
        await this.createAlertIfNotExists(
          `Supplier ${supplier.name} has an outstanding debt of KES ${supplier.outstandingDebt.toLocaleString()}.`,
          'warning',
          AlertPriority.MEDIUM
        );
      }
    } catch (error) {
      console.error('[AlertScanner] Error scanning supplier debts:', error);
    }
  }

  /**
   * Scans Orders pending for over 24 hours
   */
  private static async scanPendingOrders(): Promise<void> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const stalePendingOrders = await prisma.order.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lte: oneDayAgo },
        },
        take: 5,
      });

      if (stalePendingOrders.length > 0) {
        await this.createAlertIfNotExists(
          `${stalePendingOrders.length} customer order(s) have been PENDING for over 24 hours.`,
          'warning',
          AlertPriority.MEDIUM
        );
      }
    } catch (error) {
      console.error('[AlertScanner] Error scanning pending orders:', error);
    }
  }

  /**
   * Deduplicating alert creation helper: prevents flooding the database with identical unread alerts
   */
  private static async createAlertIfNotExists(
    message: string,
    type: string,
    priority: AlertPriority
  ): Promise<void> {
    const existing = await prisma.alert.findFirst({
      where: {
        message,
        isRead: false,
      },
    });

    if (!existing) {
      await prisma.alert.create({
        data: {
          message,
          type,
          priority,
          isRead: false,
        },
      });
      console.log(`[AlertScanner] Created alert: [${priority}] ${message}`);
    }
  }

  /**
   * Initializes the scheduled background worker
   */
  public static startScheduler(): void {
    console.log('[AlertScanner] Starting alert scanner scheduler (interval: every 2 minutes)...');
    
    // Immediate initial scan on server boot
    setTimeout(() => {
      this.runScan().catch((err) => console.error('[AlertScanner] Initial scan failed:', err));
    }, 3000);

    // Runs every 2 minutes
    cron.schedule('*/2 * * * *', () => {
      this.runScan().catch((err) => console.error('[AlertScanner] Scheduled scan failed:', err));
    });
  }
}

export default AlertScannerService;
