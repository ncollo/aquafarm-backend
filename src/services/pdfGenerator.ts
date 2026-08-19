import PDFDocument from 'pdfkit';

export const generateReceiptPDF = async (order: any, mpesaReceipt: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      // Collect data chunks into a buffer
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // 1. Company Header
      doc.fontSize(20).font('Helvetica-Bold').text('Aquafarm Fisheries Ltd', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text('Nakuru / Nairobi, Kenya', { align: 'center' });
      doc.text('Email: info@aquafarm.co.ke | Tel: +254 700 000 000', { align: 'center' });
      doc.moveDown();
      doc.moveTo(50, 115).lineTo(550, 115).stroke(); // Horizontal Line
      doc.moveDown(2);

      // 2. Transaction Meta & Customer Info
      doc.fontSize(14).font('Helvetica-Bold').text('OFFICIAL RECEIPT');
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica');
      doc.text(`Order Number: ${order.orderNumber}`);
      doc.text(`Date: ${new Date().toLocaleString('en-KE')}`);
      doc.text(`M-Pesa Ref: ${mpesaReceipt}`);
      doc.moveDown();

      doc.font('Helvetica-Bold').text('Billed To:');
      doc.font('Helvetica').text(order.customerName || 'Guest Customer');
      doc.text(order.customerPhone || 'N/A');
      if (order.customerEmail) doc.text(order.customerEmail);
      if (order.deliveryAddress) doc.text(`Delivery: ${order.deliveryAddress}`);
      doc.moveDown(2);

      // 3. Itemized Table Header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item Description', 50, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Unit Price', 400, tableTop);
      doc.text('Subtotal', 480, tableTop);
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // 4. Items
      let currentY = tableTop + 25;
      doc.font('Helvetica');

      order.items?.forEach((item: any) => {
        const itemName = item.product?.name || 'Aquafarm Item';
        const qty = item.quantity || 1;
        const subtotal = item.subtotal || 0;
        const unitPrice = qty > 0 ? subtotal / qty : 0;

        doc.text(itemName, 50, currentY);
        doc.text(qty.toString(), 300, currentY);
        doc.text(Number(unitPrice).toLocaleString(), 400, currentY);
        doc.text(Number(subtotal).toLocaleString(), 480, currentY);
        currentY += 20;
      });

      doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
      currentY += 15;

      // 5. Financial Summary (Calculating 16% inclusive VAT)
      const totalAmount = order.totalAmount || 0;
      const netAmount = totalAmount / 1.16;
      const vatAmount = totalAmount - netAmount;

      doc.font('Helvetica-Bold');
      doc.text('Net Amount (KES):', 350, currentY);
      doc.font('Helvetica').text(netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 480, currentY);
      currentY += 20;

      doc.font('Helvetica-Bold');
      doc.text('VAT 16% (KES):', 350, currentY);
      doc.font('Helvetica').text(vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), 480, currentY);
      currentY += 20;

      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('TOTAL PAID (KES):', 350, currentY);
      doc.text(totalAmount.toLocaleString(), 480, currentY);

      // 6. Policy Footer
      doc.moveDown(4);
      doc.fontSize(9).font('Helvetica-Oblique').fillColor('gray');
      doc.text('Terms & Conditions:', 50);
      doc.text('1. Due to the perishable nature of our products, all claims for damaged stock must be made within 24 hours of delivery.');
      doc.text('2. Keep live fingerlings aerated immediately upon receipt. Aquafarm is not liable for stock lost due to improper handling post-delivery.');
      doc.text('Thank you for choosing Aquafarm Fisheries!', { align: 'center', underline: false });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};