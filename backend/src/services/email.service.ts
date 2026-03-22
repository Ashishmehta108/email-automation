import nodemailer from 'nodemailer';
import { emailLogRepository } from '../repository/email-log.repository.js';
import type { EmailConfig, SendEmailOptions, CreateEmailLogInput } from '../types/index.js';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private config: EmailConfig | null = null;

  /**
   * Create OAuth2 transporter for Gmail
   */
  private createTransporter(config: EmailConfig): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: config.user,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
      },
    });
  }

  /**
   * Initialize email transporter with config
   */
  initialize(config: EmailConfig): void {
    this.config = config;
    this.transporter = this.createTransporter(config);
  }

  /**
   * Get or create transporter
   */
  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      if (!this.config) {
        throw new Error('Email service not initialized. Call initialize() first.');
      }
      this.transporter = this.createTransporter(this.config);
    }
    return this.transporter;
  }

  /**
   * Send a single email with optional attachment
   */
  async sendEmail(
    options: SendEmailOptions,
    certificateId?: number
  ): Promise<void> {
    const transporter = this.getTransporter();

    // Create email log
    const logInput: CreateEmailLogInput = {
      certificateId,
      recipientEmail: options.to,
      subject: options.subject,
    };
    const emailLog = await emailLogRepository.create(logInput);

    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: `"Certificate Team" <${this.config?.user}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments?.map((att) => ({
          filename: att.filename,
          path: att.path,
        })),
      };

      await transporter.sendMail(mailOptions);

      // Mark as sent
      await emailLogRepository.markAsSent(emailLog.id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await emailLogRepository.markAsFailed(emailLog.id, errorMessage);
      throw error;
    }
  }

  /**
   * Send certificate email to student
   */
  async sendCertificateEmail(
    studentEmail: string,
    studentName: string,
    eventName: string,
    pdfPath: string,
    certificateId: number
  ): Promise<void> {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2 style="color: #1B2B4B;">Dear ${studentName},</h2>
          <p>Congratulations on successfully completing <strong>${eventName}</strong>!</p>
          <p>Your certificate of completion is attached to this email.</p>
          <p>Best regards,<br/>The ${eventName} Team</p>
        </body>
      </html>
    `;

    await this.sendEmail(
      {
        to: studentEmail,
        subject: `Certificate of Completion - ${eventName}`,
        html,
        attachments: [
          {
            filename: pdfPath.split('/').pop() || 'certificate.pdf',
            path: pdfPath,
          },
        ],
      },
      certificateId
    );
  }

  /**
   * Send bulk certificate emails
   */
  async sendBulkCertificateEmails(
    emails: Array<{
      studentEmail: string;
      studentName: string;
      eventName: string;
      pdfPath: string;
      certificateId: number;
    }>
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const email of emails) {
      try {
        await this.sendCertificateEmail(
          email.studentEmail,
          email.studentName,
          email.eventName,
          email.pdfPath,
          email.certificateId
        );
        success++;
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to send to ${email.studentEmail}: ${errorMessage}`);
      }
    }

    return { success, failed, errors };
  }
}

export const emailService = new EmailService();
