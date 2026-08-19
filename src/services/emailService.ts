import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for port 465, false for other ports (like 587)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendReceiptEmail = async (
  toEmail: string, 
  customerName: string, 
  orderNumber: string, 
  pdfBuffer: Buffer
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Aquafarm Fisheries" <${process.env.FROM_EMAIL}>`,
    to: toEmail,
    subject: `Your Aquafarm Receipt - Order ${orderNumber}`,
    text: `Dear ${customerName},\n\nThank you for your purchase from Aquafarm Fisheries! Your payment has been successfully processed.\n\nPlease find your official receipt attached to this email.\n\nBest regards,\nThe Aquafarm Team`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Thank you for your order!</h2>
        <p>Dear ${customerName},</p>
        <p>We have successfully received your payment for order <strong>${orderNumber}</strong>.</p>
        <p>Your official tax receipt is attached to this email as a PDF document. Please keep it for your records.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The Aquafarm Fisheries Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `Aquafarm_Receipt_${orderNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Receipt email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error('Error sending receipt email:', error);
    // We don't throw here so that an email failure doesn't crash the M-Pesa webhook response
  }
};