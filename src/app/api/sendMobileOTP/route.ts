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
    const { phone, name }: any = reqBody;
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });

    const mobileOtp = Math.floor(100000 + Math.random() * 900000);
    let mobileOtpdata = new PhoneOtp({
      phone: phone,
      code: mobileOtp,
      expiresIn: new Date().getTime() + 300 * 1000,
    });
    const message = `Hello ${name} your OTP is ${mobileOtp}. Please use it before 10 Minutes.`;
    await client.start({
      phoneNumber: async () => "+91" + phone,
      password: async () => "", // optional 2FA password if enabled
      phoneCode: async () => {
        throw new Error("OTP required — run setup separately to get session.");
      },
      onError: (err) => console.log("Error:", err),
    });
    const user = await client.getEntity("+91" + phone);
    await client.sendMessage(user, { message });

    // const message_id = await sendToTelegram(message);
    // mobileOtpdata.message_id = message_id;
    await mobileOtpdata.save();
    return NextResponse.json(
      { message: "OTP sent successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Error sending OTP", success: false },
      { status: 200 }
    );
  }
}

// import dbConnect from "../../../lib/dbConnect";
// import { NextRequest, NextResponse } from "next/server";
// import PhoneOtp from "../../../models/phoneOtp";
// import sendToTelegram from "../../../lib/sendToTelegram";

// dbConnect();
// export async function POST(request: NextRequest) {
//   try {
//     const reqBody = await request.json();
//     const { phone, name }: any = reqBody;
//     const mobileOtp = Math.floor(100000 + Math.random() * 900000);
//     let mobileOtpdata = new PhoneOtp({
//       phone: phone,
//       code: mobileOtp,
//       expiresIn: new Date().getTime() + 300 * 1000,
//     });
//     const message = `Hello ${name} your OTP is ${mobileOtp}. Please use it before 10 Minutes.`;
//    const message_id= await sendToTelegram( message);
//     mobileOtpdata.message_id=message_id;
//     await mobileOtpdata.save();
//     return NextResponse.json(
//       { message: "OTP sent successfully", success: true },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: "Error sending OTP", success: false },
//       { status: 200 }
//     );
//   }
// }
