import dbConnect from "../../../lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import PhoneOtp from "../../../models/phoneOtp";
import sendToTelegram from "../../../lib/sendToTelegram";

dbConnect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { phone, name }: any = reqBody;
    const mobileOtp = Math.floor(100000 + Math.random() * 900000);
    let mobileOtpdata = new PhoneOtp({
      phone: phone,
      code: mobileOtp,
      expiresIn: new Date().getTime() + 300 * 1000,
    });
    const message = `Hello ${name} your OTP is ${mobileOtp}. Please use it before 10 Minutes.`;
   const message_id= await sendToTelegram( message);
    mobileOtpdata.message_id=message_id;
    await mobileOtpdata.save();
    return NextResponse.json(
      { message: "OTP sent successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error sending OTP", success: false },
      { status: 200 }
    );
  }
}
