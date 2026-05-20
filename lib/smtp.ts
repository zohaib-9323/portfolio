import nodemailer from "nodemailer";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return { host, port, user, pass };
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

export type MailPayload = {
  subject: string;
  text: string;
  html: string;
};

function getAlertRecipient(config: NonNullable<ReturnType<typeof getSmtpConfig>>): string {
  return (
    process.env.SERVICE_ALERT_EMAIL?.trim() ||
    process.env.CONTACT_TO?.trim() ||
    process.env.SMTP_TO?.trim() ||
    config.user
  );
}

export async function sendMailMessage(payload: MailPayload): Promise<void> {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured on the server.");
  }

  const to = getAlertRecipient(config);
  const from =
    process.env.SMTP_FROM || `"Portfolio" <${config.user}>`;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

export async function sendContactEmail(payload: ContactPayload): Promise<void> {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured on the server.");
  }

  const to =
    process.env.CONTACT_TO ||
    process.env.SMTP_TO ||
    config.user;

  const from =
    process.env.SMTP_FROM || `"Portfolio Contact" <${config.user}>`;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const subject = `Portfolio message from ${payload.name}`;
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px;">
      <h2 style="margin: 0 0 16px;">New portfolio message</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(payload.message)}</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
