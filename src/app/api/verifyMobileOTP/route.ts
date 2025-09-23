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
        // In your POST function, replace the deletion part with:
        const sameUserMessages = await PhoneOtp.find({ phone });

        // Delete sequentially with better error handling
        const deletionResults = [];
        for (const message of sameUserMessages) {
          console.log(`Processing message deletion for code: ${message.code}`);
          const result = await deleteTelegramMessage(
            message.phone,
            message.code
          );
          deletionResults.push(result);
        }

        console.log("Deletion results:", deletionResults);

        // Delete from database regardless of Telegram deletion success
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
    const otpRecord = await PhoneOtp.findOne({ phone, code });

    if (!otpRecord || !otpRecord.message_id) {
      console.log(`No message record found for ${phone}`);
      return { success: false, error: "No record found" };
    }

    console.log("Attempting to delete message:", {
      message_id: otpRecord.message_id,
      chat_id: otpRecord.chat_id,
      phone: phone,
    });

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.connect();

    if (!(await client.checkAuthorization())) {
      console.log("Client not authorized");
      return { success: false, error: "Not authorized" };
    }

    // Method 1: Try to get the user entity
    let targetEntity;
    try {
      targetEntity = await client.getEntity("+91" + phone);
      console.log("Found user entity:", targetEntity);
    } catch (error) {
      console.log("Could not find user by phone, trying by ID...");
      if (otpRecord.chat_id) {
        targetEntity = await client.getEntity(otpRecord.chat_id);
        console.log("Found entity by ID:", targetEntity);
      }
    }

    if (!targetEntity) {
      console.log("Could not find target entity");
      return { success: false, error: "Entity not found" };
    }

    // Method 2: Try different deletion approaches
    try {
      // Approach 1: Direct deletion
      await client.deleteMessages(
        targetEntity,
        [parseInt(otpRecord.message_id)],
        {
          revoke: true,
        }
      );
      console.log("✅ Message deleted successfully");
      return { success: true };
    } catch (deleteError: any) {
      console.log("Direct deletion failed, trying alternative approach...");

      // Approach 2: Get the message first, then delete
      try {
        const messages = await client.getMessages(targetEntity, {
          ids: [parseInt(otpRecord.message_id)],
        });

        if (messages.length > 0 && messages[0]) {
          await client.deleteMessages(targetEntity, [messages[0].id], {
            revoke: true,
          });
          console.log("✅ Message deleted via lookup approach");
          return { success: true };
        } else {
          console.log("Message not found in chat - may be already deleted");
          return { success: true, note: "Message already deleted" };
        }
      } catch (lookupError) {
        console.log("Lookup approach also failed:", lookupError);

        // Approach 3: Delete by iterating through messages
        try {
          const recentMessages = await client.getMessages(targetEntity, {
            limit: 10,
          });
          const messageToDelete = recentMessages.find(
            (msg) => msg.text && msg.text.includes(otpRecord.code.toString())
          );

          if (messageToDelete) {
            await client.deleteMessages(targetEntity, [messageToDelete.id], {
              revoke: true,
            });
            console.log("✅ Message deleted via content search");
            return { success: true };
          } else {
            console.log("Could not find message by content");
            return { success: false, error: "Message not found" };
          }
        } catch (finalError) {
          console.log("All deletion approaches failed");
          return { success: false, error: finalError };
        }
      }
    }
  } catch (error: any) {
    console.error(`Error deleting message for ${phone}:`, error);
    return { success: false, error: error.message };
  }
};
