import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

/**
 * Sends a notification email using Resend.
 * Fallback to console log if API key is missing.
 */
export async function sendNotificationEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
    return { success: true, mocked: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Primetek Portal <notifications@primetek.com>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email Send Crash:', err);
    return { success: false, error: err };
  }
}

/**
 * Template for new assignment notification.
 */
export function getAssignmentTemplate(employeeName: string, clientName: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #0f172a;">New Client Profile Assigned</h2>
      <p>Hi ${employeeName},</p>
      <p>A new client profile for <strong>${clientName}</strong> has been assigned to you for processing.</p>
      <div style="margin: 30px 0;">
        <a href="https://primetek-portal.vercel.app/employee/assigned-profiles" 
           style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          View Assignment
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px;">Regards,<br>Primetek Global Solutions</p>
    </div>
  `;
}
