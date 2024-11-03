import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import PhoneOtp from "../../../models/phoneOtp";
import deleteTelegramMessage from "../../../lib/deleteTelegramMessage";
dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone, phoneCode }: any = reqBody;
    console.log(reqBody);
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
        await PhoneOtp.deleteMany({ phone });
        await deleteTelegramMessage(phoneData.message_id)
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
