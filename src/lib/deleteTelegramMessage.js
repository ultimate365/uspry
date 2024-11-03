import axios from "axios";

// Function to send message
export default async function deleteTelegramMessage(message_id) {
  // Replace with your bot token and chat ID
  const botToken = process.env.USPRYS_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.USPRYS_TELEGRAM_GROUP_ID;
  const url = `https://api.telegram.org/bot${botToken}/deleteMessage?chat_id=${chatId}&message_id=${message_id}`;
  try {
    const response = await axios.post(url);

    console.log("Message deleted successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
}
