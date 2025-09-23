import mongoose from "mongoose";

let phoneOtpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    code: { type: String, required: true },
    message_id: { type: Number, required: true }, // Telegram message ID
    chat_id: { type: Number, required: true }, // Telegram peer (user/chat ID)
    expiresIn: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const PhoneOtp =
  mongoose.models.phoneotp ||
  mongoose.model("phoneotp", phoneOtpSchema, "phoneotp");

export default PhoneOtp;
