import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { message, email, postTitle, subscribe } = await req.json();

    let subscribeOk = true;
    let messageOk = true;

    // Kit v4 API: create inactive subscriber, then add to form
    if (subscribe && email) {
      try {
        // 1. Create inactive subscriber
        const createRes = await fetch("https://api.kit.com/v4/subscribers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Kit-Api-Key": process.env.KIT_API_KEY!,
          },
          body: JSON.stringify({
            email_address: email,
            state: "inactive",
          }),
        });
        if (!createRes.ok) throw new Error("Failed to create subscriber");

        // 2. Add subscriber to form
        const addRes = await fetch(
          `https://api.kit.com/v4/forms/${process.env.KIT_FORM_ID}/subscribers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Kit-Api-Key": process.env.KIT_API_KEY!,
            },
            body: JSON.stringify({ email_address: email }),
          }
        );
        if (!addRes.ok) throw new Error("Failed to add subscriber to form");
      } catch {
        subscribeOk = false;
      }
    }

    // Message logic
    if (message) {
      try {
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
      } catch {
        messageOk = false;
      }
    }

    // Response logic
    if (subscribeOk && messageOk) {
      return NextResponse.json({ ok: true });
    }
    if (!subscribeOk && !messageOk) {
      return NextResponse.json(
        { ok: false, error: "Subscription and message failed." },
        { status: 500 }
      );
    }
    if (!subscribeOk) {
      return NextResponse.json(
        { ok: false, error: "Subscription failed." },
        { status: 500 }
      );
    }
    if (!messageOk) {
      return NextResponse.json(
        { ok: false, error: "Message failed." },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
