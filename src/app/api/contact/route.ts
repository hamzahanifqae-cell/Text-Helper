import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
  // Honeypot field: real users never fill this in; bots that auto-fill
  // every field will, so a non-empty value is treated as spam.
  company: z.string().max(200).optional(),
});

function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.CONTACT_SMTP_HOST &&
      process.env.CONTACT_SMTP_USER &&
      process.env.CONTACT_SMTP_PASS &&
      process.env.CONTACT_TO_EMAIL
  );
}

export async function GET() {
  return NextResponse.json({ enabled: isSmtpConfigured() });
}

export async function POST(request: NextRequest) {
  if (!isSmtpConfigured()) {
    return NextResponse.json(
      { error: "The contact form is not configured on this server yet. Please use the published contact email instead." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
  }
  const { name, email, message, company } = parsed.data;
  if (company && company.trim().length > 0) {
    // Silently accept to not tip off bots, but do not actually send.
    return NextResponse.json({ ok: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.CONTACT_SMTP_HOST,
      port: Number(process.env.CONTACT_SMTP_PORT ?? 587),
      secure: process.env.CONTACT_SMTP_SECURE === "true",
      auth: {
        user: process.env.CONTACT_SMTP_USER,
        pass: process.env.CONTACT_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || process.env.CONTACT_SMTP_USER,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `TextHelper contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "The message could not be sent right now. Please try again later or email us directly." },
      { status: 502 }
    );
  }
}
