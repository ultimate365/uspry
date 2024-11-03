import axios from "axios";
export const sendOTPSMS = async (phone: string, mobileOtp: number) => {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: mobileOtp,
        route: "otp",
        numbers: phone,
      },
      {
        headers: {
          Authorization: process.env.USPRYS_FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.return
  } catch (error) {
    return { success: false, message: "Failed to send OTP." };
  }
};
