import { sendBrevoWelcomeEmail, syncBrevoContact, BrevoEmailResult } from "./brevo";

export interface SendNewsletterWelcomeParams {
  toEmail: string;
  recipientName?: string | null;
}

/**
 * Send automated confirmation & welcome email from newsletter@author.in
 * Uses Brevo Automation REST API, Brevo Contact Sync, and fallback to Brevo SMTP / nodemailer.
 */
export async function sendNewsletterWelcomeEmail({
  toEmail,
  recipientName,
}: SendNewsletterWelcomeParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // 1. Sync contact into Brevo contact list to trigger Brevo marketing automation workflows
  try {
    await syncBrevoContact({
      email: toEmail,
      name: recipientName,
    });
  } catch (err: any) {
    console.warn("[Brevo Sync] Continuing despite contact sync notice:", err.message);
  }

  // 2. Dispatch the world-class Solitude Dispatch welcome email via Brevo
  const result: BrevoEmailResult = await sendBrevoWelcomeEmail({
    toEmail,
    recipientName,
  });

  return {
    success: result.success,
    messageId: result.messageId,
    error: result.error,
  };
}

export { syncBrevoContact, sendBrevoWelcomeEmail } from "./brevo";
