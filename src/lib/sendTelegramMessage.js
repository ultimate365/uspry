// Import the axios library

import axios from "axios";

// Function to send message
export default async function sendTelegramMessage(message) {
  // Replace with your bot token and chat ID
  const botToken = process.env.USPRYS_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.USPRYS_TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
    });

    // console.log("Message sent successfully:", response.data);
    return response.data
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
}
