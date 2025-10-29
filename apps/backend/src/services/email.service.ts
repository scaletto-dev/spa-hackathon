import { Resend } from 'resend';
import { ContactSubmissionDTO } from '../types/contact';

/**
 * Email Service
 * Handles email sending with retry logic
 */
class EmailService {
  private resend: Resend | null = null;
  private maxRetries = 3;
  private baseDelay = 1000; // 1 second
  private initialized = false;

  constructor() {
    // Don't initialize here - do it lazily on first use
  }

  /**
   * Initialize Resend client (lazy initialization)
   */
  private initialize(): void {
    if (this.initialized) return;

    const apiKey = process.env.RESEND_API_KEY;
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
      console.log('✅ Email service initialized with Resend API');
    } else {
      console.warn('⚠️ RESEND_API_KEY not configured. Email notifications will be disabled.');
    }

    this.initialized = true;
  }

  /**
   * Send contact form notification email to admin
   * Implements retry logic with exponential backoff
   */
  async sendContactFormNotification(submission: ContactSubmissionDTO): Promise<void> {
    // Initialize on first use
    this.initialize();

    if (!this.resend) {
      console.error('❌ Email service not configured. Skipping email notification.');
      return;
    }

    const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (!recipientEmail) {
      console.error('❌ CONTACT_NOTIFICATION_EMAIL not configured. Skipping email notification.');
      return;
    }

    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    console.log(`📧 Sending contact form notification to ${recipientEmail}...`);

    const emailContent = this.createContactNotificationTemplate(submission);

    let lastError: Error | null = null;

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const { data, error } = await this.resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          replyTo: submission.email,
          subject: `New Contact Form Submission - ${this.formatMessageType(submission.messageType)}`,
          html: emailContent,
        });

        if (error) {
          throw new Error(error.message || 'Failed to send email');
        }

        console.log(`✅ Contact form notification email sent successfully to ${recipientEmail}`);
        console.log(`Email ID: ${data?.id}`);
        return; // Success, exit function
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Email send attempt ${attempt} failed:`, error);

        if (attempt < this.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = this.baseDelay * Math.pow(2, attempt - 1);
          console.log(`⏳ Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed, log but don't throw (don't block contact submission)
    console.error(`Failed to send contact notification email after ${this.maxRetries} attempts:`, lastError);
  }

  /**
   * Create HTML email template for contact form notification
   */
  private createContactNotificationTemplate(submission: ContactSubmissionDTO): string {
    const messageTypeLabel = this.formatMessageType(submission.messageType);
    const phoneDisplay = submission.phone || 'Not provided';
    const timestamp = new Date(submission.createdAt).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long',
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
          <h1 style="color: #2c3e50; margin-top: 0; font-size: 24px;">
            📬 New Contact Form Submission
          </h1>
          <p style="color: #7f8c8d; margin-bottom: 0; font-size: 14px;">
            Received on ${timestamp}
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px;">
          <h2 style="color: #34495e; font-size: 18px; margin-top: 0; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            Submission Details
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1; font-weight: bold; width: 140px; color: #7f8c8d;">
                Name:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1;">
                ${this.escapeHtml(submission.name)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1; font-weight: bold; color: #7f8c8d;">
                Email:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1;">
                <a href="mailto:${submission.email}" style="color: #3498db; text-decoration: none;">
                  ${submission.email}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1; font-weight: bold; color: #7f8c8d;">
                Phone:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1;">
                ${this.escapeHtml(phoneDisplay)}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1; font-weight: bold; color: #7f8c8d;">
                Message Type:
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #ecf0f1;">
                <span style="background-color: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 4px; font-size: 13px;">
                  ${messageTypeLabel}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: bold; color: #7f8c8d; vertical-align: top;">
                Message:
              </td>
              <td style="padding: 12px 0;">
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; white-space: pre-wrap; word-wrap: break-word;">
                  ${this.escapeHtml(submission.message)}
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #856404;">
            <strong>⚠️ Action Required:</strong> Please respond to this inquiry within 24 hours.
          </p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #95a5a6; font-size: 12px;">
          <p>This is an automated notification from Beauty Clinic Care Contact Form</p>
          <p style="margin-top: 5px;">Submission ID: ${submission.id}</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Format message type enum to human-readable label
   */
  private formatMessageType(messageType: string): string {
    const typeMap: Record<string, string> = {
      GENERAL_INQUIRY: 'General Inquiry',
      SERVICE_QUESTION: 'Service Question',
      BOOKING_ASSISTANCE: 'Booking Assistance',
      FEEDBACK: 'Feedback',
      OTHER: 'Other',
    };

    return typeMap[messageType] || messageType;
  }

  /**
   * Escape HTML to prevent XSS in email content
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (char) => map[char] || char);
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new EmailService();
