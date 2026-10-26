import nodemailer from 'nodemailer';
import { Resend } from 'resend';

/**
 * Sends one email to the shop's inbox. Two ways, whichever is configured:
 *
 * 1. SMTP (recommended on Hostinger) — sends from the shop's own mailbox:
 *      SMTP_HOST=smtp.hostinger.com  SMTP_PORT=465
 *      SMTP_USER=admin@whitediamondpack.com  SMTP_PASS=<mailbox password>
 * 2. Resend — RESEND_API_KEY (+ ORDER_NOTIFY_FROM with a verified domain)
 *
 * Recipient: NOTIFY_EMAIL (or the older ORDER_NOTIFY_EMAIL), comma-separated for several;
 * defaults to SMTP_USER. With nothing configured it quietly does nothing.
 * It never throws — a failed email must never fail an order or a form.
 */
export async function sendShopEmail(mail: { subject: string; html: string; replyTo?: string | null }): Promise<void> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const toRaw = process.env.NOTIFY_EMAIL || process.env.ORDER_NOTIFY_EMAIL || smtpUser;
  if (!toRaw) return;
  const to = toRaw.split(',').map((s) => s.trim()).filter(Boolean);
  const replyTo = mail.replyTo || undefined;

  try {
    if (smtpHost && smtpUser && smtpPass) {
      const port = Number(process.env.SMTP_PORT || 465);
      const transport = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465, // 465 = SSL; 587 = STARTTLS
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transport.sendMail({ from: `White Diamond Website <${smtpUser}>`, to, replyTo, subject: mail.subject, html: mail.html });
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { error } = await new Resend(apiKey).emails.send({
        from: process.env.ORDER_NOTIFY_FROM || 'White Diamond <onboarding@resend.dev>',
        to,
        replyTo,
        subject: mail.subject,
        html: mail.html,
      });
      if (error) console.error('[mail] send failed:', error);
    }
  } catch (err) {
    console.error('[mail] send failed:', err);
  }
}
