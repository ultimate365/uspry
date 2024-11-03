import axios from "axios";

const sendToTelegram = async (message) => {
  try {
  const response=  await axios.post(
      `https://api.telegram.org/bot${process.env.USPRYS_TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.USPRYS_TELEGRAM_GROUP_ID, // Replace 'CHAT_ID' with your actual chat ID
        text: message,
      }
    )
    // console.log('Message sent:', response.data);
    return response.data.result.message_id;
  } catch (error) {
    // console.error('Error sending message:', error);
  }
};
export default sendToTelegram;
