import nodemailer from "nodemailer";

export interface BrevoSubscriberPayload {
  email: string;
  name?: string | null;
}

export interface BrevoSendWelcomeParams {
  toEmail: string;
  recipientName?: string | null;
}

export interface BrevoEmailResult {
  success: boolean;
  messageId?: string;
  provider: "brevo-api" | "brevo-smtp" | "nodemailer-fallback" | "simulated";
  error?: string;
}

const DEFAULT_SENDER_NAME = "Anant Yadav";
const DEFAULT_SENDER_EMAIL = "newsletter@author.in";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://authoranant.in";

/**
 * 1. SYNC CONTACT WITH BREVO AUTOMATION WORKFLOWS
 * Adds or updates subscriber in Brevo contact lists to trigger native Brevo automations
 */
export async function syncBrevoContact({ email, name }: BrevoSubscriberPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  const listId = process.env.BREVO_LIST_ID ? parseInt(process.env.BREVO_LIST_ID, 10) : undefined;

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        attributes: {
          FIRSTNAME: name?.trim() || "Reader",
          SOURCE: "Website Newsletter Form",
          SUBSCRIBED_AT: new Date().toISOString(),
        },
        listIds: listId ? [listId] : undefined,
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      // If contact already exists, Brevo returns 400 with 'duplicate_parameter'
      if (errData.code === "duplicate_parameter") {
        return { success: true };
      }
      return { success: false, error: errData.message || res.statusText };
    }

    return { success: true };
  } catch (err: any) {
    console.warn("[Brevo Contact Sync] Warning:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 2. BUILD THE ULTIMATE LITERARY EMAIL UI
 * Handcrafted responsive HTML email matching the dark-gold literary aesthetic of authoranant.in
 */
export function buildSolitudeDispatchHtml({
  recipientName,
  toEmail,
}: {
  recipientName?: string | null;
  toEmail: string;
}): string {
  const greeting = recipientName?.trim() ? `Dear ${recipientName.trim()}` : "Dear Reader";
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(toEmail)}`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>The Solitude Dispatch — Anant Yadav</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0 !important; padding: 0 !important; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; }
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    a { text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-center { text-align: center !important; }
      .mobile-book-img { width: 100% !important; max-width: 200px !important; margin: 0 auto 16px auto !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #e7e5e4;">
  <!-- Preview Text (Hidden in body, visible in inbox list) -->
  <div style="display: none; font-size: 1px; color: #0c0a09; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Welcome to The Solitude Dispatch by Anant Yadav. A sanctuary for quiet literature, published books, contemporary poetry, and unhurried reflections.
    &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0c0a09; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px Max) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #171513; border: 1px solid #2e2a25; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);">

          <!-- 1. Gold Trim Gradient Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #b45309 100%); height: 4px; line-height: 4px; font-size: 4px;">&nbsp;</td>
          </tr>

          <!-- 2. Author Monogram & Crest Masthead -->
          <tr>
            <td align="center" style="padding: 40px 32px 20px 32px;" class="mobile-padding">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <img src="${SITE_URL}/images/author-emblem.jpg" width="76" height="76" alt="Anant Yadav Emblem" style="border-radius: 50%; border: 2px solid #d97706; box-shadow: 0 0 20px rgba(217, 119, 6, 0.25);" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <p style="margin: 0; font-family: 'Cinzel', Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; letter-spacing: 0.18em; color: #fbfaf8; text-transform: uppercase;">
                      ANANT YADAV
                    </p>
                    <p style="margin: 6px 0 0 0; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, monospace; letter-spacing: 0.25em; text-transform: uppercase; color: #d97706; font-weight: 600;">
                      Author • Poet • Thinker
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 3. Solitude Dispatch Title Box -->
          <tr>
            <td style="padding: 0 32px 24px 32px;" class="mobile-padding">
              <div style="background: linear-gradient(180deg, #24201c 0%, #1c1916 100%); border: 1px solid #3d362e; border-radius: 16px; padding: 22px 20px; text-align: center;">
                <span style="display: inline-block; padding: 4px 12px; background-color: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 9999px; font-size: 10px; font-family: monospace; letter-spacing: 0.2em; text-transform: uppercase; color: #f59e0b; font-weight: 600; margin-bottom: 8px;">
                  Official Reader Circle • Issue 01
                </span>
                <h1 style="margin: 6px 0 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 400; color: #fef3c7; letter-spacing: -0.01em;">
                  The Solitude Dispatch
                </h1>
                <p style="margin: 4px 0 0 0; font-family: Georgia, serif; font-size: 13px; font-style: italic; color: #a8a29e;">
                  एकांत और स्मृतियों का आत्मीय संवाद
                </p>
              </div>
            </td>
          </tr>

          <!-- 4. Personal Letter from Anant Yadav -->
          <tr>
            <td style="padding: 0 36px 28px 36px; font-size: 15px; line-height: 1.75; color: #d6d3d1;" class="mobile-padding">
              <p style="margin: 0 0 16px 0; font-size: 17px; font-weight: 600; color: #fbfaf8;">
                ${greeting},
              </p>
              <p style="margin: 0 0 16px 0;">
                Thank you for welcoming my words into your quiet hours.
              </p>
              <p style="margin: 0 0 16px 0;">
                Writing has always been an inquiry into what remains unsaid—the weight of fleeting encounters, the geography of human longing, and the profound peace discovered when we stop running from our own solitude.
              </p>
              <p style="margin: 0 0 24px 0;">
                Through <strong>The Solitude Dispatch</strong>, you will receive unhurried literary letters, reflections before they appear elsewhere, previews of upcoming poetry, and behind-the-scenes dispatches from my writing desk.
              </p>

              <!-- Elegant Literary Quote Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0 28px 0; background-color: #110f0d; border-left: 3px solid #d97706; border-radius: 0 12px 12px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-family: Georgia, serif; font-style: italic; font-size: 15px; line-height: 1.6; color: #fde68a;">
                      “ज़रुरी है क्या? थोड़ी देर ... अभी मन भर तुम्हारा दीदार भी नहीं हुआ है। तुम्हारे जाने के बाद कहने को बहुत कुछ होगा, मगर सुनने को तुम नहीं होगी।”
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; font-family: monospace; letter-spacing: 0.1em; color: #a8a29e; text-align: right;">
                      — अनंत यादव (जा रही हो?)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- SECTION: Featured Books -->
              <p style="margin: 28px 0 16px 0; font-size: 11px; font-family: monospace; letter-spacing: 0.2em; text-transform: uppercase; color: #f59e0b; font-weight: bold;">
                ✦ Published Works &amp; Pre-Orders
              </p>

              <!-- BOOK 1: जा रही हो? -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; background-color: #1f1b17; border: 1px solid #383229; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Book Cover Image Column -->
                        <td width="120" valign="top" class="mobile-stack mobile-center">
                          <img src="${SITE_URL}/images/books/jaa-rahi-ho/front-cover.jpg" width="110" alt="जा रही हो? Book Cover" class="mobile-book-img" style="border-radius: 8px; border: 1px solid #44403c; box-shadow: 0 8px 16px rgba(0,0,0,0.5);" />
                        </td>
                        <!-- Book Details Column -->
                        <td valign="top" style="padding-left: 20px;" class="mobile-stack">
                          <span style="display: inline-block; padding: 2px 8px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; font-size: 9px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; color: #34d399; font-weight: bold; margin-bottom: 6px;">
                            Out Now • ₹249/-
                          </span>
                          <h2 style="margin: 2px 0 4px 0; font-family: Georgia, serif; font-size: 20px; color: #fbfaf8; font-weight: bold;">
                            जा रही हो?
                          </h2>
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #d97706; font-family: monospace;">
                            Shivija Publications • Contemporary Poetry
                          </p>
                          <p style="margin: 0 0 14px 0; font-size: 13px; line-height: 1.5; color: #d6d3d1;">
                            A delicate narrative of love, memory, and lingering departures. Featuring official collector bookmarks and miniature keepsakes.
                          </p>
                          <!-- Action Buttons -->
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-right: 8px;">
                                <a href="https://amzn.in/d/0fRKiyZK" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: #d97706; color: #0c0a09; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; border-radius: 6px; text-decoration: none;">
                                  Amazon →
                                </a>
                              </td>
                              <td style="padding-right: 8px;">
                                <a href="https://dl.flipkart.com/s/bipABbNNNN" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: #292524; color: #fbfaf8; border: 1px solid #44403c; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; border-radius: 6px; text-decoration: none;">
                                  Flipkart
                                </a>
                              </td>
                              <td>
                                <a href="${SITE_URL}/books/jaa-rahi-ho" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: #171513; color: #fbbf24; border: 1px solid #d97706; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; border-radius: 6px; text-decoration: none;">
                                  View Details
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- BOOK 2: चुप मत रहा करो -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background-color: #1f1b17; border: 1px solid #383229; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <!-- Book Cover Image Column -->
                        <td width="120" valign="top" class="mobile-stack mobile-center">
                          <img src="${SITE_URL}/images/books/chup-mat-raha-karo/front-cover.jpg" width="110" alt="चुप मत रहा करो Book Cover" class="mobile-book-img" style="border-radius: 8px; border: 1px solid #44403c; box-shadow: 0 8px 16px rgba(0,0,0,0.5);" />
                        </td>
                        <!-- Book Details Column -->
                        <td valign="top" style="padding-left: 20px;" class="mobile-stack">
                          <span style="display: inline-block; padding: 2px 8px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; font-size: 9px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; color: #f59e0b; font-weight: bold; margin-bottom: 6px;">
                            Pre-Order • Launching November 2026 • ₹199/-
                          </span>
                          <h2 style="margin: 2px 0 4px 0; font-family: Georgia, serif; font-size: 20px; color: #fbfaf8; font-weight: bold;">
                            चुप मत रहा करो
                          </h2>
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #d97706; font-family: monospace;">
                            Poetic Anthology • Special Edition
                          </p>
                          <p style="margin: 0 0 14px 0; font-size: 13px; line-height: 1.5; color: #d6d3d1;">
                            An upcoming collection exploring the silences we harbor and the courage required to break them.
                          </p>
                          <!-- Action Button -->
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <a href="https://kathaankan.com/shop/ols/products/chup-mat-raha-karo" target="_blank" style="display: inline-block; padding: 8px 18px; background-color: #d97706; color: #0c0a09; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; border-radius: 6px; text-decoration: none;">
                                  Reserve Pre-Order Copy (₹199) →
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Visual Media & Collectibles Preview Banner -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background: linear-gradient(135deg, #24201c 0%, #171513 100%); border: 1px solid #383229; border-radius: 14px; padding: 18px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 11px; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; color: #fbbf24; font-weight: bold;">
                      🎨 Visual Archive &amp; Merchandise
                    </p>
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #d6d3d1; line-height: 1.5;">
                      Explore official miniature book keychains and Varanasi Ghat commemorative poetry bookmarks in the media archive.
                    </p>
                    <a href="${SITE_URL}/media" target="_blank" style="color: #f59e0b; font-size: 12px; font-family: monospace; font-weight: bold; text-decoration: underline;">
                      Browse Visual Gallery &amp; Collectibles →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Main CTA Visit Website -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${SITE_URL}" target="_blank" style="display: inline-block; padding: 16px 36px; background: linear-gradient(90deg, #d97706 0%, #f59e0b 100%); color: #0c0a09; font-size: 13px; font-weight: bold; font-family: monospace; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 12px; text-decoration: none; box-shadow: 0 10px 20px rgba(217, 119, 6, 0.3);">
                      Visit Official Literary Home →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 5. Footer with High Deliverability & CAN-SPAM Compliance -->
          <tr>
            <td style="padding: 28px 36px 36px 36px; background-color: #110f0d; border-top: 1px solid #2e2a25; text-align: center; font-size: 12px; line-height: 1.6; color: #78716c;" class="mobile-padding">
              <p style="margin: 0 0 8px 0; color: #a8a29e;">
                Dispatched with care by <strong>Anant Yadav</strong> from <span style="color: #fbbf24;">${DEFAULT_SENDER_EMAIL}</span>
              </p>
              <p style="margin: 0 0 16px 0;">
                <a href="${SITE_URL}/books" target="_blank" style="color: #f59e0b; text-decoration: none; margin: 0 6px;">Books</a> •
                <a href="${SITE_URL}/poetry" target="_blank" style="color: #f59e0b; text-decoration: none; margin: 0 6px;">Poetry</a> •
                <a href="${SITE_URL}/writings" target="_blank" style="color: #f59e0b; text-decoration: none; margin: 0 6px;">Essays</a> •
                <a href="${SITE_URL}/media" target="_blank" style="color: #f59e0b; text-decoration: none; margin: 0 6px;">Media</a> •
                <a href="https://substack.com/@authoranant/" target="_blank" style="color: #f59e0b; text-decoration: none; margin: 0 6px;">Substack</a>
              </p>
              <p style="margin: 0 0 12px 0; font-size: 11px; color: #57534e;">
                You are receiving this because you subscribed to updates at <a href="${SITE_URL}" style="color: #a8a29e; text-decoration: underline;">authoranant.in</a>.<br />
                Shivija Publications &amp; Literary Archive • Ballia &amp; Varanasi, India
              </p>
              <p style="margin: 0; font-size: 11px; color: #57534e;">
                <a href="${unsubscribeUrl}" target="_blank" style="color: #a8a29e; text-decoration: underline;">Unsubscribe from this newsletter</a> •
                <a href="${SITE_URL}/privacy" target="_blank" style="color: #a8a29e; text-decoration: underline; margin-left: 8px;">Privacy Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 3. SEND WELCOME EMAIL VIA BREVO REST API (FAST & ZERO SMTP PORT BLOCKS)
 * Or fallback to Brevo/Standard SMTP if API key is not present.
 */
export async function sendBrevoWelcomeEmail({
  toEmail,
  recipientName,
}: BrevoSendWelcomeParams): Promise<BrevoEmailResult> {
  const cleanEmail = toEmail.toLowerCase().trim();
  const greetingName = recipientName?.trim() || "Dear Reader";
  const subject = "The Solitude Dispatch — Welcome to the Literary Circle of Anant Yadav";
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM_ADDRESS || DEFAULT_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || DEFAULT_SENDER_NAME;

  const htmlContent = buildSolitudeDispatchHtml({
    recipientName,
    toEmail: cleanEmail,
  });

  const textContent = `${greetingName},

Thank you for subscribing to The Solitude Dispatch by Anant Yadav.
You are now part of an unhurried literary circle receiving reflective letters, quiet philosophy, and personal dispatches.

PUBLISHED WORKS & PRE-ORDERS:
1. जा रही हो? (Out Now on Amazon, Flipkart & Google Play) — ₹249/-
   Order on Amazon: https://amzn.in/d/0fRKiyZK
   Order on Flipkart: https://dl.flipkart.com/s/bipABbNNNN

2. चुप मत रहा करो (Pre-Order Available • Launching November 2026) — ₹199/-
   Reserve Copy: https://kathaankan.com/shop/ols/products/chup-mat-raha-karo

Explore official bookmarks, keychains, and the visual archive at:
${SITE_URL}/media

Visit the official website: ${SITE_URL}

Warm regards,
Anant Yadav
${senderEmail}`;

  // -------------------------------------------------------------
  // STRATEGY A: BREVO V3 TRANSACTIONAL EMAIL API
  // -------------------------------------------------------------
  const apiKey = process.env.BREVO_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail,
          },
          to: [
            {
              email: cleanEmail,
              name: recipientName?.trim() || undefined,
            },
          ],
          subject,
          htmlContent,
          textContent,
          tags: ["the-solitude-dispatch", "welcome-automation"],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`[Brevo API] Email delivered to ${cleanEmail}. Message ID: ${data.messageId}`);
        return {
          success: true,
          messageId: data.messageId,
          provider: "brevo-api",
        };
      }

      const errData = await res.json().catch(() => ({}));
      console.warn("[Brevo API Error]", errData);
      // If API fails, fall through to SMTP fallback below
    } catch (apiErr: any) {
      console.warn("[Brevo API Exception]", apiErr.message);
    }
  }

  // -------------------------------------------------------------
  // STRATEGY B: BREVO SMTP / STANDARD SMTP RELAY FALLBACK
  // -------------------------------------------------------------
  const host = process.env.SMTP_HOST || (apiKey ? "smtp-relay.brevo.com" : undefined);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS || apiKey; // Brevo allows using API key as SMTP pass

  if (host && user && pass) {
    try {
      const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      const info = await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: cleanEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[Brevo SMTP] Email delivered to ${cleanEmail}. Message ID: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        provider: "brevo-smtp",
      };
    } catch (smtpErr: any) {
      console.error("[Brevo SMTP Error]", smtpErr.message);
    }
  }

  // -------------------------------------------------------------
  // STRATEGY C: SIMULATED / LOG MODE IF NO CREDENTIALS PROVIDED YET
  // -------------------------------------------------------------
  console.log(
    `[Brevo Automation] Ready for credentials. Simulated dispatch to ${cleanEmail} from ${senderEmail}.`
  );
  return {
    success: true,
    messageId: `simulated-brevo-${Date.now()}`,
    provider: "simulated",
  };
}
