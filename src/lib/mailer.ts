import nodemailer from "nodemailer";

/**
 * Gmail SMTP via Nodemailer.
 *
 * Tradeoff note: Gmail SMTP with an App Password is free and works fine from
 * Vercel serverless functions for low volume (a personal contact form). For
 * higher deliverability / volume you'd switch to a transactional provider like
 * Resend or SendGrid — but for this use case Gmail is simplest and reliable.
 * IMPORTANT: use a Gmail "App Password", not your normal account password.
 */

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      "EMAIL_USER / EMAIL_APP_PASSWORD are not set. Configure Gmail SMTP."
    );
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Notify the site owner that someone submitted the contact form. */
export async function sendContactNotification(data: ContactPayload) {
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;
  const from = process.env.EMAIL_USER;

  await getTransporter().sendMail({
    from: `"Portfolio Contact" <${from}>`,
    to,
    replyTo: data.email,
    subject: `📬 New contact: ${data.subject}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}`,
    html: contactNotificationHtml(data),
  });
}

/** Optional auto-reply confirmation to the person who reached out. */
export async function sendAutoReply(data: ContactPayload) {
  const from = process.env.EMAIL_USER;
  try {
    await getTransporter().sendMail({
      from: `"Anushka Pandit" <${from}>`,
      to: data.email,
      subject: "Thanks for reaching out!",
      text: `Hi ${data.name},\n\nThanks for your message — I've received it and will get back to you soon.\n\nBest,\nAnushka Pandit`,
      html: autoReplyHtml(data),
    });
  } catch {
    // Auto-reply is best-effort; never fail the request because of it.
  }
}

function contactNotificationHtml(d: ContactPayload): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#1e293b">
    <h2 style="color:#4f46e5">New portfolio contact</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;font-weight:600;width:90px">Name</td><td>${escapeHtml(d.name)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Email</td><td>${escapeHtml(d.email)}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600">Subject</td><td>${escapeHtml(d.subject)}</td></tr>
    </table>
    <p style="margin-top:16px;white-space:pre-wrap;background:#f1f5f9;padding:14px;border-radius:8px">${escapeHtml(d.message)}</p>
  </div>`;
}

function autoReplyHtml(d: ContactPayload): string {
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;color:#1e293b">
    <p>Hi ${escapeHtml(d.name)},</p>
    <p>Thanks for your message — I've received it and will get back to you soon.</p>
    <p style="color:#64748b;font-size:13px">For reference, your message:</p>
    <p style="white-space:pre-wrap;background:#f1f5f9;padding:14px;border-radius:8px">${escapeHtml(d.message)}</p>
    <p>Best,<br/>Anushka Pandit</p>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
