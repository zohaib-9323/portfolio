import { NextResponse } from "next/server";
import { isSmtpConfigured, sendContactEmail } from "@/lib/smtp";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  message?: string;
};

function validate(body: Body): { ok: true; data: { name: string; email: string; message: string } } | { ok: false; error: string } {
  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || name.length < 2) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (!message || message.length < 10) {
    return { ok: false, error: "Message must be at least 10 characters." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message is too long." };
  }

  return { ok: true, data: { name, email, message } };
}

export async function POST(request: Request) {
  if (!isSmtpConfigured()) {
    return NextResponse.json(
      {
        error:
          "Email is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS to your environment.",
      },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = validate(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    await sendContactEmail(parsed.data);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] SMTP send failed:", err);
    return NextResponse.json(
      {
        error:
          "Could not send your message. Check SMTP credentials or try again later.",
      },
      { status: 500 }
    );
  }
}
