import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message, email, postTitle } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }
    const subject = `New comment on ${postTitle || "your blog"}`;
    const text = `Message: ${message}\n\nReply email: ${
      email || "(not provided)"
    }`;
    await resend.emails.send({
      from: "website@bimon.dev",
      to: "timon@bimon.dev",
      subject,
      text,
      replyTo: email || undefined,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
