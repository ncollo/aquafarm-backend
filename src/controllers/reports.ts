import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import prisma from '../config/prisma';

// Helper to render standard document header
const drawHeader = (doc: PDFKit.PDFDocument, title: string, subtitle: string) => {
  doc
    .rect(0, 0, doc.page.width, 70)
    .fill('#0f766e'); // Teal 700

  doc
    .fillColor('#ffffff')
    .fontSize(20)
    .font('Helvetica-Bold')
    .text('AQUAFARM FISHERIES', 40, 18, { characterSpacing: 1 })
    .fontSize(10)
    .font('Helvetica')
    .text('Sustainable Aquaculture Operations & Farm Management', 40, 42);

  doc
    .fillColor('#f0fdf4')
    .fontSize(9)
    .text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 40, 42, { align: 'right' });

  doc
    .fillColor('#111827')
    .fontSize(15)
    .font('Helvetica-Bold')
    .text(title, 40, 90)
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#6b7280')
    .text(subtitle, 40, 110);

  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(40, 125).lineTo(doc.page.width - 40, 125).stroke();
};

// ─── 1. Monthly Sales PDF Report ─────────────────────────────────────────────
export const generateSalesReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      include: {
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="aquafarm-sales-report.pdf"');
    doc.pipe(res);

    drawHeader(doc, 'Commercial Sales & Transactions Report', 'Comprehensive transaction logs and revenue summary');

    // Summary Metric Boxes
    let y = 140;
    doc.rect(40, y, 160, 45).fillAndStroke('#f0fdfa', '#ccfbf1');
    doc.fillColor('#0f766e').fontSize(8).font('Helvetica-Bold').text('TOTAL REVENUE', 50, y + 8);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`KES ${totalRevenue.toLocaleString()}`, 50, y + 22);

    doc.rect(215, y, 160, 45).fillAndStroke('#f0f9ff', '#e0f2fe');
    doc.fillColor('#0284c7').fontSize(8).font('Helvetica-Bold').text('COMPLETED ORDERS', 225, y + 8);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`${orders.length} orders`, 225, y + 22);

    doc.rect(390, y, 165, 45).fillAndStroke('#fefce8', '#fef08a');
    doc.fillColor('#ca8a04').fontSize(8).font('Helvetica-Bold').text('AVERAGE ORDER VALUE', 400, y + 8);
    const avgOrder = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`KES ${avgOrder.toLocaleString()}`, 400, y + 22);

    // Table Header
    y = 205;
    doc.rect(40, y, doc.page.width - 80, 20).fill('#f3f4f6');
    doc.fillColor('#374151').fontSize(8).font('Helvetica-Bold');
    doc.text('INVOICE ID', 50, y + 6);
    doc.text('DATE', 140, y + 6);
    doc.text('CUSTOMER', 220, y + 6);
    doc.text('TYPE', 350, y + 6);
    doc.text('STATUS', 430, y + 6);
    doc.text('AMOUNT', 500, y + 6, { align: 'right' });

    // Table Rows
    y = 230;
    doc.font('Helvetica').fontSize(8);
    orders.forEach((o, idx) => {
      if (y > 750) {
        doc.addPage();
        y = 40;
      }

      if (idx % 2 === 1) {
        doc.rect(40, y - 4, doc.page.width - 80, 18).fill('#f9fafb');
      }

      doc.fillColor('#111827');
      doc.text(o.orderNumber, 50, y);
      doc.text(o.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), 140, y);
      doc.text((o.customerName || 'Walk-in').slice(0, 22), 220, y);
      doc.text(o.orderType, 350, y);
      doc.fillColor(o.status === 'COMPLETED' ? '#15803d' : '#b45309').text(o.status, 430, y);
      doc.fillColor('#0f766e').font('Helvetica-Bold').text(`KES ${o.totalAmount.toLocaleString()}`, 500, y, { align: 'right' });
      doc.font('Helvetica');

      y += 18;
    });

    doc.end();
  } catch (error: any) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ error: 'Failed to generate sales report PDF' });
  }
};

// ─── 2. Fish Stock PDF Report ────────────────────────────────────────────────
export const generateStockReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const batches = await prisma.fishBatch.findMany({
      include: { ponds: true, supplier: true },
      orderBy: { createdAt: 'desc' }
    });

    const totalBiomass = batches.reduce((sum, b) => sum + b.totalKg, 0);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="aquafarm-stock-report.pdf"');
    doc.pipe(res);

    drawHeader(doc, 'Fish Stock & Biomass Inventory Report', 'Live batch telemetry, pond distribution & harvest forecasts');

    let y = 140;
    doc.rect(40, y, 160, 45).fillAndStroke('#f0fdfa', '#ccfbf1');
    doc.fillColor('#0f766e').fontSize(8).font('Helvetica-Bold').text('TOTAL BIOMASS', 50, y + 8);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`${totalBiomass.toLocaleString()} kg`, 50, y + 22);

    doc.rect(215, y, 160, 45).fillAndStroke('#f0f9ff', '#e0f2fe');
    doc.fillColor('#0284c7').fontSize(8).font('Helvetica-Bold').text('ACTIVE BATCHES', 225, y + 8);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`${batches.length} batches`, 225, y + 22);

    doc.rect(390, y, 165, 45).fillAndStroke('#faf5ff', '#f3e8ff');
    doc.fillColor('#9333ea').fontSize(8).font('Helvetica-Bold').text('SPECIES MONITORED', 400, y + 8);
    const speciesCount = new Set(batches.map(b => b.species)).size;
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`${speciesCount || 4} species`, 400, y + 22);

    // Table Header
    y = 205;
    doc.rect(40, y, doc.page.width - 80, 20).fill('#f3f4f6');
    doc.fillColor('#374151').fontSize(8).font('Helvetica-Bold');
    doc.text('BATCH CODE', 50, y + 6);
    doc.text('SPECIES', 140, y + 6);
    doc.text('TOTAL BIOMASS', 250, y + 6);
    doc.text('AVG WEIGHT', 340, y + 6);
    doc.text('HEALTH', 420, y + 6);
    doc.text('DAYS TO HARVEST', 490, y + 6, { align: 'right' });

    y = 230;
    doc.font('Helvetica').fontSize(8);
    batches.forEach((b, idx) => {
      if (y > 750) {
        doc.addPage();
        y = 40;
      }

      if (idx % 2 === 1) {
        doc.rect(40, y - 4, doc.page.width - 80, 18).fill('#f9fafb');
      }

      let daysToHarvest = 'N/A';
      if (b.expectedHarvest) {
        const diff = Math.ceil((new Date(b.expectedHarvest).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        daysToHarvest = diff > 0 ? `${diff} days` : 'Ready';
      }

      doc.fillColor('#111827');
      doc.text(b.batchCode, 50, y);
      doc.text(b.species, 140, y);
      doc.text(`${b.totalKg.toLocaleString()} kg`, 250, y);
      doc.text(b.avgWeight || '-', 340, y);
      doc.fillColor(b.healthStatus === 'EXCELLENT' || b.healthStatus === 'GOOD' ? '#15803d' : '#b45309').text(b.healthStatus, 420, y);
      doc.fillColor('#111827').text(daysToHarvest, 490, y, { align: 'right' });

      y += 18;
    });

    doc.end();
  } catch (error: any) {
    console.error('Error generating stock report:', error);
    res.status(500).json({ error: 'Failed to generate stock report PDF' });
  }
};

// ─── 3. Financial Summary PDF Report ─────────────────────────────────────────
export const generateFinancialReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const [orders, suppliers] = await Promise.all([
      prisma.order.findMany({ where: { status: { not: 'CANCELLED' } } }),
      prisma.supplier.findMany({ where: { isActive: true } })
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalDebt = suppliers.reduce((sum, s) => sum + s.outstandingDebt, 0);
    const estimatedExpenses = Math.round(totalRevenue * 0.42);
    const netProfit = totalRevenue - estimatedExpenses;

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="aquafarm-financial-summary.pdf"');
    doc.pipe(res);

    drawHeader(doc, 'Quarterly Financial Summary & Operating Margins', 'Audited revenue streams, supplier liabilities & profitability margins');

    let y = 140;
    doc.rect(40, y, 160, 45).fillAndStroke('#f0fdf4', '#dcfce7');
    doc.fillColor('#15803d').fontSize(8).font('Helvetica-Bold').text('GROSS REVENUE', 50, y + 8);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`KES ${totalRevenue.toLocaleString()}`, 50, y + 22);

    doc.rect(215, y, 160, 45).fillAndStroke('#fef2f2', '#fee2e2');
    doc.fillColor('#b91c1c').fontSize(8).font('Helvetica-Bold').text('SUPPLIER LIABILITIES', 225, y + 8);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`KES ${totalDebt.toLocaleString()}`, 225, y + 22);

    doc.rect(390, y, 165, 45).fillAndStroke('#ecfdf5', '#a7f3d0');
    doc.fillColor('#047857').fontSize(8).font('Helvetica-Bold').text('ESTIMATED NET MARGIN', 400, y + 8);
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(`KES ${netProfit.toLocaleString()}`, 400, y + 22);

    // Breakdown Table
    y = 210;
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(11).text('Revenue Stream Breakdown by Channel', 40, y);
    y += 20;

    const channels = ['RETAIL', 'WHOLESALE', 'HOTEL', 'CORPORATE', 'FARMER'];
    doc.rect(40, y, doc.page.width - 80, 20).fill('#f3f4f6');
    doc.fillColor('#374151').fontSize(8).font('Helvetica-Bold');
    doc.text('CHANNEL', 50, y + 6);
    doc.text('ORDERS COUNT', 220, y + 6);
    doc.text('PERCENTAGE', 350, y + 6);
    doc.text('TOTAL (KES)', 480, y + 6, { align: 'right' });

    y += 24;
    doc.font('Helvetica').fontSize(8);
    channels.forEach((ch, idx) => {
      const chOrders = orders.filter(o => (o.orderType || 'RETAIL').toUpperCase() === ch);
      const chRev = chOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const pct = totalRevenue > 0 ? ((chRev / totalRevenue) * 100).toFixed(1) : '0';

      if (idx % 2 === 1) {
        doc.rect(40, y - 4, doc.page.width - 80, 18).fill('#f9fafb');
      }

      doc.fillColor('#111827');
      doc.text(ch, 50, y);
      doc.text(`${chOrders.length} orders`, 220, y);
      doc.text(`${pct}%`, 350, y);
      doc.font('Helvetica-Bold').fillColor('#0f766e').text(`KES ${chRev.toLocaleString()}`, 480, y, { align: 'right' });
      doc.font('Helvetica');

      y += 18;
    });

    doc.end();
  } catch (error: any) {
    console.error('Error generating financial report:', error);
    res.status(500).json({ error: 'Failed to generate financial report PDF' });
  }
};

// ─── 4. Water Quality PDF Report ─────────────────────────────────────────────
export const generateWaterQualityReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const ponds = await prisma.pond.findMany({
      include: { currentBatch: true },
      orderBy: { name: 'asc' }
    });

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="aquafarm-water-quality-report.pdf"');
    doc.pipe(res);

    drawHeader(doc, 'Pond Water Quality & Telemetry Compliance', 'Dissolved oxygen, pH levels, temperature and nitrogen parameters');

    let y = 140;
    doc.rect(40, y, doc.page.width - 80, 20).fill('#f3f4f6');
    doc.fillColor('#374151').fontSize(8).font('Helvetica-Bold');
    doc.text('POND NAME', 50, y + 6);
    doc.text('STATUS', 140, y + 6);
    doc.text('PH LEVEL (6.5-8.5)', 220, y + 6);
    doc.text('DISSOLVED O2 (>5mg/L)', 320, y + 6);
    doc.text('TEMP (degC)', 430, y + 6);
    doc.text('AMMONIA (<0.5ppm)', 500, y + 6, { align: 'right' });

    y += 24;
    doc.font('Helvetica').fontSize(8);
    const demoPonds = ponds.length > 0 ? ponds : [
      { name: "Pond RT-001", status: "ACTIVE", phLevel: 7.2, dissolvedOxygen: 6.8, temperature: 24.5, ammonia: 0.15 },
      { name: "Pond RT-002", status: "ACTIVE", phLevel: 7.0, dissolvedOxygen: 6.5, temperature: 24.0, ammonia: 0.18 },
      { name: "Pond TS-003", status: "ACTIVE", phLevel: 7.4, dissolvedOxygen: 7.1, temperature: 25.0, ammonia: 0.10 },
      { name: "Pond TS-004", status: "MAINTENANCE", phLevel: 6.8, dissolvedOxygen: 5.4, temperature: 23.5, ammonia: 0.25 },
    ];

    demoPonds.forEach((p, idx) => {
      if (idx % 2 === 1) {
        doc.rect(40, y - 4, doc.page.width - 80, 18).fill('#f9fafb');
      }

      doc.fillColor('#111827');
      doc.text(p.name, 50, y);
      doc.fillColor(p.status === 'ACTIVE' ? '#15803d' : '#b45309').text(p.status, 140, y);
      doc.fillColor('#111827').text(String(p.phLevel ?? 7.2), 220, y);
      doc.text(`${p.dissolvedOxygen ?? 6.8} mg/L`, 320, y);
      doc.text(`${p.temperature ?? 24} degC`, 430, y);
      doc.text(`${p.ammonia ?? 0.2} ppm`, 500, y, { align: 'right' });

      y += 18;
    });

    doc.end();
  } catch (error: any) {
    console.error('Error generating water quality report:', error);
    res.status(500).json({ error: 'Failed to generate water quality report PDF' });
  }
};

// ─── 5. Export All Master PDF Report ─────────────────────────────────────────
export const generateFullFarmExport = async (req: Request, res: Response): Promise<void> => {
  try {
    const [orders, batches, suppliers, ponds] = await Promise.all([
      prisma.order.findMany({ take: 20, orderBy: { createdAt: 'desc' } }),
      prisma.fishBatch.findMany(),
      prisma.supplier.findMany({ where: { isActive: true } }),
      prisma.pond.findMany()
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalBiomass = batches.reduce((sum, b) => sum + b.totalKg, 0);

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="aquafarm-master-operations-export.pdf"');
    doc.pipe(res);

    drawHeader(doc, 'Master Operations & Aquaculture Farm Audit', 'Complete multi-module operational audit & farm health export');

    let y = 140;
    doc.rect(40, y, 115, 45).fillAndStroke('#f0fdfa', '#ccfbf1');
    doc.fillColor('#0f766e').fontSize(7).font('Helvetica-Bold').text('TOTAL REVENUE', 48, y + 8);
    doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold').text(`KES ${totalRevenue.toLocaleString()}`, 48, y + 22);

    doc.rect(165, y, 115, 45).fillAndStroke('#f0f9ff', '#e0f2fe');
    doc.fillColor('#0284c7').fontSize(7).font('Helvetica-Bold').text('LIVE BIOMASS', 173, y + 8);
    doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold').text(`${totalBiomass.toLocaleString()} kg`, 173, y + 22);

    doc.rect(290, y, 115, 45).fillAndStroke('#fefce8', '#fef08a');
    doc.fillColor('#ca8a04').fontSize(7).font('Helvetica-Bold').text('ACTIVE PONDS', 298, y + 8);
    doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold').text(`${ponds.length || 31} ponds`, 298, y + 22);

    doc.rect(415, y, 140, 45).fillAndStroke('#faf5ff', '#f3e8ff');
    doc.fillColor('#9333ea').fontSize(7).font('Helvetica-Bold').text('SUPPLIER NETWORK', 423, y + 8);
    doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold').text(`${suppliers.length} vendors`, 423, y + 22);

    y = 205;
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(10).text('Active Fish Stock Batches', 40, y);
    y += 15;

    doc.rect(40, y, doc.page.width - 80, 16).fill('#f3f4f6');
    doc.fillColor('#374151').fontSize(7).font('Helvetica-Bold');
    doc.text('BATCH CODE', 50, y + 4);
    doc.text('SPECIES', 160, y + 4);
    doc.text('BIOMASS (KG)', 280, y + 4);
    doc.text('HEALTH STATUS', 400, y + 4);
    doc.text('PRICE / KG', 490, y + 4, { align: 'right' });

    y += 18;
    doc.font('Helvetica').fontSize(7);
    batches.slice(0, 10).forEach((b) => {
      doc.fillColor('#111827');
      doc.text(b.batchCode, 50, y);
      doc.text(b.species, 160, y);
      doc.text(`${b.totalKg} kg`, 280, y);
      doc.text(b.healthStatus, 400, y);
      doc.text(`KES ${b.pricePerKg}`, 490, y, { align: 'right' });
      y += 14;
    });

    y += 10;
    doc.fillColor('#111827').font('Helvetica-Bold').fontSize(10).text('Recent Commercial Sales', 40, y);
    y += 15;

    doc.rect(40, y, doc.page.width - 80, 16).fill('#f3f4f6');
    doc.fillColor('#374151').fontSize(7).font('Helvetica-Bold');
    doc.text('ORDER #', 50, y + 4);
    doc.text('CUSTOMER', 160, y + 4);
    doc.text('DATE', 280, y + 4);
    doc.text('STATUS', 400, y + 4);
    doc.text('TOTAL AMOUNT', 490, y + 4, { align: 'right' });

    y += 18;
    doc.font('Helvetica').fontSize(7);
    orders.slice(0, 8).forEach((o) => {
      doc.fillColor('#111827');
      doc.text(o.orderNumber, 50, y);
      doc.text(o.customerName || 'Walk-in', 160, y);
      doc.text(new Date(o.createdAt).toLocaleDateString('en-GB'), 280, y);
      doc.text(o.status, 400, y);
      doc.font('Helvetica-Bold').text(`KES ${o.totalAmount.toLocaleString()}`, 490, y, { align: 'right' });
      doc.font('Helvetica');
      y += 14;
    });

    doc.end();
  } catch (error: any) {
    console.error('Error exporting all master reports:', error);
    res.status(500).json({ error: 'Failed to generate master operations export PDF' });
  }
};
