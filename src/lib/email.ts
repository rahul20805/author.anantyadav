import nodemailer from "nodemailer";

export interface SendNewsletterWelcomeParams {
  toEmail: string;
  recipientName?: string | null;
}

/**
 * Creates a nodemailer transporter based on environment configuration.
 * Supports:
 * 1. Standard free SMTP (e.g. Brevo, Mailgun, SendGrid, Zoho, custom domain)
 * 2. Gmail SMTP (Free tier: 500 emails/day using Gmail App Password)
 * 3. Fallback test/log mode if credentials are not configured yet
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Gmail free service fallback
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });
  }

  return null;
}

/**
 * Send automated confirmation & welcome email from newsletter@author.in
 */
export async function sendNewsletterWelcomeEmail({
  toEmail,
  recipientName,
}: SendNewsletterWelcomeParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const fromAddress = process.env.EMAIL_FROM || '"Anant Yadav" <newsletter@author.in>';
  const greetingName = recipientName ? recipientName.trim() : "Dear Reader";

  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to The Solitude Dispatch</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e7e5e4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0a09; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1c1917; border: 1px solid #292524; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #d97706, #f59e0b, #d97706); height: 5px;"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center;">
              <p style="margin: 0; font-family: 'Cinzel', Georgia, serif; font-size: 20px; font-weight: 700; letter-spacing: 0.15em; color: #f5f5f4;">
                ANANT YADAV
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; font-family: monospace; letter-spacing: 0.2em; text-transform: uppercase; color: #d97706;">
                Author • Poet • Thinker
              </p>
            </td>
          </tr>

          <!-- Welcome Banner -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="background-color: #292524; border: 1px solid #44403c; border-radius: 14px; padding: 18px; text-align: center;">
                <p style="margin: 0; font-size: 11px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; color: #f59e0b;">
                  Subscription Confirmed
                </p>
                <h1 style="margin: 8px 0 0 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal; color: #fef3c7;">
                  The Solitude Dispatch
                </h1>
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 36px; font-size: 15px; line-height: 1.7; color: #d6d3d1;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #f5f5f4;">
                ${greetingName},
              </p>
              <p style="margin: 0 0 16px 0;">
                Thank you for subscribing. You are now part of an unhurried literary circle receiving reflective letters, quiet philosophy, upcoming poems, and personal dispatches directly from the author’s desk.
              </p>
              
              <!-- Featured Books Section -->
              <div style="margin: 24px 0; padding: 20px; background-color: #141210; border-left: 3px solid #f59e0b; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase; color: #f59e0b; font-weight: bold;">
                  Featured Releases:
                </p>
                <p style="margin: 0 0 10px 0; color: #f5f5f4; font-size: 14px;">
                  📖 <strong>जा रही हो?</strong> — <em>(Out Now on Amazon, Flipkart & Google Play)</em><br />
                  A delicate story of memory, parting, and the words left unspoken.
                </p>
                <p style="margin: 0; color: #f5f5f4; font-size: 14px;">
                  ✨ <strong>चुप मत रहा करो</strong> — <em>(Pre-Order Available • Launching November 2026 • ₹199)</em><br />
                  A poetic tribute to the silences that long to speak.
                </p>
              </div>

              <!-- Quote -->
              <blockquote style="margin: 20px 0; padding: 14px 18px; border-left: 2px solid #78716c; font-family: Georgia, serif; font-style: italic; color: #a8a29e; font-size: 14px; background-color: #171513;">
                “To write is not merely to capture what exists, but to listen attentively to what silence has left unsaid.”
              </blockquote>

              <p style="margin: 0 0 24px 0;">
                Whenever a new essay, poem, or book preview is published, you will receive it first here.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: #d97706;">
                    <a href="https://authoranant.in" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 13px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; color: #0c0a09; text-decoration: none; border-radius: 10px;">
                      Visit Official Website →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px 36px 36px; border-top: 1px solid #292524; text-align: center; font-size: 12px; color: #78716c;">
              <p style="margin: 0 0 6px 0;">
                Sent with literary care from <strong>newsletter@author.in</strong>
              </p>
              <p style="margin: 0 0 12px 0;">
                <a href="https://authoranant.in/books" style="color: #f59e0b; text-decoration: none; margin: 0 8px;">Books</a> •
                <a href="https://authoranant.in/poetry" style="color: #f59e0b; text-decoration: none; margin: 0 8px;">Poetry</a> •
                <a href="https://authoranant.in/writings" style="color: #f59e0b; text-decoration: none; margin: 0 8px;">Writings</a> •
                <a href="https://substack.com/@authoranant/" style="color: #f59e0b; text-decoration: none; margin: 0 8px;">Substack</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #57534e;">
                © 2026 Anant Yadav. All rights reserved. • <a href="https://authoranant.in/privacy" style="color: #78716c; text-decoration: underline;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const transporter = getTransporter();

  if (!transporter) {
    console.log(
      `[Newsletter Dispatch] Free SMTP credentials not yet set in .env. Notification for ${toEmail} from ${fromAddress} simulated successfully.`
    );
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject: "Welcome to The Solitude Dispatch — Anant Yadav",
      text: `${greetingName},\n\nThank you for subscribing to The Solitude Dispatch by Anant Yadav.\n\nExplore published books, contemporary poetry, and philosophical essays at https://authoranant.in\n\nFeatured:\n- जा रही हो? (Out Now on Amazon, Flipkart & Google Play)\n- चुप मत रहा करो (Pre-Order Available • Launching November 2026)\n\nWarm regards,\nAnant Yadav\nnewsletter@author.in`,
      html: emailHtml,
    });

    console.log(`[Newsletter] Welcome email sent to ${toEmail}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[Newsletter Error] Could not send email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}
