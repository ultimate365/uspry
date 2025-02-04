import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import PhoneOtp from "../../../models/phoneOtp";
import deleteTelegramMessage from "../../../lib/deleteTelegramMessage";
// import sendToTelegram from "@/lib/sendToTelegram";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone, phoneCode, name }: any = reqBody;
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
        const sameUserMessages = await PhoneOtp.find({ phone });
        sameUserMessages.map(async (message) => {
          await deleteTelegramMessage(message.message_id);
          await message.delete();
        });
        // const message = `Welcome ${name} To Our App.`;
        // const message_id = await sendToTelegram(message);
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
