import { NextResponse } from "next/server";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

// Save session after first login (set it in .env after OTP verification)
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

export async function POST(req) {
  try {
    const { phoneNumber, message } = await req.json();
console.log(phoneNumber, message);
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    // Start client (will ask for OTP only first time, then you can save session string)
    await client.start({
      phoneNumber: async () => phoneNumber,
      password: async () => "", // optional 2FA password if enabled
      phoneCode: async () => {
        throw new Error("OTP required — run setup separately to get session.");
      },
      onError: (err) => console.log("Error:", err),
    });

    console.log("Session:", client.session.save());

    const user = await client.getEntity(phoneNumber);
    await client.sendMessage(user, { message });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
