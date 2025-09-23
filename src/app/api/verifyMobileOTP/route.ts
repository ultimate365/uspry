import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import PhoneOtp from "../../../models/phoneOtp";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH || "";
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");
dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone, phoneCode }: any = reqBody;
    const phoneData = await PhoneOtp.findOne({ phone, code: phoneCode });

    if (phoneData) {
      const currentTime = new Date().getTime();
      const phoneDifference = phoneData.expiresIn - currentTime;

      if (phoneDifference < 0) {
        return NextResponse.json(
          {
            message: "OTP Expired",
            success: false,
            statusText: "error",
          },
          { status: 200 }
        );
      } else {
        // Find all OTP records for this phone
        const sameUserMessages = await PhoneOtp.find({ phone });

        // Delete all messages using Promise.all for parallel execution
        await Promise.all(
          sameUserMessages.map(async (message) => {
            try {
              await deleteTelegramMessage(message.phone, message.code);
            } catch (error) {
              console.error(
                `Failed to delete message for code ${message.code}:`,
                error
              );
              // Continue with other messages even if one fails
            }
          })
        );

        // Delete all OTP records for this phone from database
        await PhoneOtp.deleteMany({ phone });

        return NextResponse.json(
          {
            message: "Mobile Verified Successfully",
            success: true,
            statusText: "Success",
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Invalid OTP Code",
          success: false,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error in OTP verification:", error);
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

const deleteTelegramMessage = async (phone: string, code: number) => {
  try {
    // Find the OTP record
    const otpRecord = await PhoneOtp.findOne({
      phone: phone,
      code: code,
    });

    if (!otpRecord || !otpRecord.message_id) {
      console.log(`No message ID found for phone ${phone} and code ${code}`);
      return;
    }

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.connect();

    // Note: You might not need to call client.start() again if you're already authenticated
    // If the session is stored properly, you can skip the start process
    await client.start({
      phoneNumber: async () => "+91" + phone,
      password: async () => "",
      phoneCode: async () => {
        throw new Error("OTP required — run setup separately to get session.");
      },
      onError: (err) => console.log("Error in client start:", err),
    });

    const user = await client.getEntity(otpRecord.peerId);

    // Delete the message using the stored message ID
    await client.deleteMessages(user, [otpRecord.message_id], {
      revoke: true,
    });

    console.log(`Successfully deleted message for phone ${phone}`);
  } catch (error: any) {
    console.error(`Error deleting Telegram message for phone ${phone}:`, error);
    // Don't throw the error - let the calling function handle it
    throw error;
  }
};
