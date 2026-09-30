import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
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
    from: `"Aquafarm Fisheries" <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@aquafarm.co.ke'}>`,
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
  }
};

export const sendPasswordResetEmail = async (
  toEmail: string,
  userName: string,
  resetToken: string,
  resetUrl: string
): Promise<void> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Aquafarm Security" <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@aquafarm.co.ke'}>`,
    to: toEmail,
    subject: 'Aquafarm Security — Password Reset Request',
    text: `Hello ${userName},\n\nA password reset request was initiated for your Aquafarm admin account.\n\nUse this link to reset your password:\n${resetUrl}\n\nThis link will expire in 15 minutes. If you did not request this, please ignore this email.\n\nAquafarm Security Team`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #0f766e; margin: 0;">Aquafarm Fisheries</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Staff & Admin Security Center</p>
        </div>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>We received a request to reset the password for your Aquafarm account (<strong>${toEmail}</strong>).</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0f766e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Reset Your Password
          </a>
        </div>
        <p style="font-size: 13px; color: #64748b;">Or copy and paste this link into your browser:<br/><span style="color: #0f766e; word-break: break-all;">${resetUrl}</span></p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          This link will expire in 15 minutes. If you did not request this password reset, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};