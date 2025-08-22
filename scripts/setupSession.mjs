import "dotenv/config"; // <--- add this line
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(""); // empty = new session

(async () => {
  console.log("⚡ Starting Telegram login...");

  if (!apiId || !apiHash) {
    throw new Error("TELEGRAM_API_ID or TELEGRAM_API_HASH is missing in .env.local");
  }

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Enter your phone number: "),
    password: async () => await input.text("Enter 2FA password (if any): "),
    phoneCode: async () => await input.text("Enter the code you received: "),
    onError: (err) => console.log("Error:", err),
  });

  console.log("✅ Logged in successfully!");
  console.log("Save this string in your .env.local as TELEGRAM_SESSION:\n");
  console.log(client.session.save());

  process.exit();
})();
