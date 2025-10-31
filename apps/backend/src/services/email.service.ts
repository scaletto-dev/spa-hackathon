import { Resend } from 'resend';
import logger from '@/config/logger';
import { ContactSubmissionDTO } from '@/types/contact';
import { createContactNotificationTemplate } from '@/templates/contact-notification.template';
import { createBookingConfirmationTemplate } from '@/templates/booking-confirmation.template';

/**
 * Email Service
 * Handles email sending with retry logic
 * Delegates template generation to template files
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
      logger.info('Email service initialized with Resend API');
    } else {
      logger.warn('RESEND_API_KEY not configured. Email notifications will be disabled.');
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
      logger.error('Email service not configured. Skipping email notification.');
      return;
    }

    const recipientEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (!recipientEmail) {
      logger.error('CONTACT_NOTIFICATION_EMAIL not configured. Skipping email notification.');
      return;
    }

    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    logger.info(`Sending contact form notification to ${recipientEmail}...`);

    const emailContent = createContactNotificationTemplate(submission);

    let lastError: Error | null = null;

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const { data, error } = await this.resend.emails.send({
          from: fromEmail,
          to: recipientEmail,
          replyTo: submission.email,
          subject: `New Contact Form Submission - ${this.getMessageTypeLabel(submission.messageType)}`,
          html: emailContent,
        });

        if (error) {
          throw new Error(error.message || 'Failed to send email');
        }

        logger.info(`Contact form notification email sent to ${recipientEmail}`, {
          emailId: data?.id,
          submissionId: submission.id,
        });
        return; // Success, exit function
      } catch (error) {
        lastError = error as Error;
        logger.error(`Email send attempt ${attempt} failed`, {
          attempt,
          error: lastError.message,
        });

        if (attempt < this.maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = this.baseDelay * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    // All retries failed, log but don't throw (don't block contact submission)
    logger.error(`Failed to send contact notification email after ${this.maxRetries} attempts`, {
      submissionId: submission.id,
      error: lastError?.message,
    });
  }

  /**
   * Send booking confirmation email to guest
   */
  async sendBookingConfirmation(
    guestEmail: string,
    guestName: string,
    guestPhone: string,
    referenceNumber: string,
    appointmentDate: string,
    appointmentTime: string,
    branchName: string,
    branchAddress: string,
    branchPhone: string,
    serviceNames: string[],
    totalPrice: number,
    notes?: string
  ): Promise<void> {
    // Initialize on first use
    this.initialize();

    if (!this.resend) {
      logger.warn('Email service not configured. Booking confirmation email will not be sent.');
      return;
    }

    try {
      const emailContent = createBookingConfirmationTemplate(
        guestName,
        guestEmail,
        guestPhone,
        referenceNumber,
        appointmentDate,
        appointmentTime,
        branchName,
        branchAddress,
        branchPhone,
        serviceNames,
        totalPrice,
        notes
      );

      const emailResult = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: guestEmail,
        subject: `Xác nhận đặt lịch - Mã tham chiếu #${referenceNumber}`,
        html: emailContent,
      });

      if (emailResult.error) {
        logger.error('Resend API error when sending booking confirmation', {
          error: emailResult.error,
          guestEmail,
        });
      } else {
        logger.info(`Booking confirmation email sent to ${guestEmail}`, {
          emailId: emailResult.data?.id,
          referenceNumber,
        });
      }
    } catch (error) {
      logger.error('Error sending booking confirmation email', {
        error: error instanceof Error ? error.message : String(error),
        guestEmail,
        referenceNumber,
      });
      // Don't throw - email is non-critical
    }
  }

  /**
   * Get human-readable label for message type
   */
  private getMessageTypeLabel(messageType: string): string {
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
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new EmailService();
