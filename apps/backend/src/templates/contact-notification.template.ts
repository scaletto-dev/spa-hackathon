import { ContactSubmissionDTO } from '@/types/contact';

/**
 * Contact Notification Email Template
 * Sends notification to admin when new contact form is submitted
 */
export function createContactNotificationTemplate(submission: ContactSubmissionDTO): string {
  const messageTypeLabel = formatMessageType(submission.messageType);
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
              ${escapeHtml(submission.name)}
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
              ${escapeHtml(phoneDisplay)}
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
                ${escapeHtml(submission.message)}
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
function formatMessageType(messageType: string): string {
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
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
