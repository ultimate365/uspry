import nodemailer from "nodemailer";
const sendEmail = async ({ email, code, name }: any) => {
  try {
    const mail = process.env.USPRYS_GMAIL_ID || "";
    const mailpassword = process.env.USPRYS_GMAIL_PASSWORD;
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mail,
        pass: mailpassword,
      },
    });

    // const mailOptions = {
    //   from: mail,
    //   to: email,
    //   subject: `Reset your Password: Mail no ${Math.floor(
    //     Math.random() * 1000 + 1
    //   )}`,
    //   // text: `Your OTP is ${otp}`,
    //   html: `<h1 style="text-align:center; color:blue; ">Hello Dear ${name}!</h1>
    //     <h2 style="text-align:center; color:blue;">Your OTP is ${code}. Please use this OTP to reset your password.</h2>`,
    // };
    // const mailResponse = await transport.sendMail(
    //   mailOptions,
    //   function (error: any, info: any) {
    //     if (error) {
    //       console.log("error", error);
    //     } else {
    //       console.log("Email Sent: " + info.response);
    //     }
    //   }
    // );

    // return mailResponse;

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transport.verify(function (error: any, success: any) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailData = {
      from: {
        name: `WBTPTA AMTA WEST`,
        address: mail,
      },
      replyTo: email,
      to: email,
      subject: `Reset your Password: Mail no ${Math.floor(
        Math.random() * 1000 + 1
      )}`,
      text: `Hello Dear ${name}!`,
      html: `<h1 style="text-align:center; color:blue; ">Hello Dear ${name}!</h1>
        <h2 style="text-align:center; color:blue;">Your OTP is ${code}. Please use this OTP to reset your password.</h2>`,
    };

    await new Promise((resolve, reject) => {
      // send mail
      transport.sendMail(mailData, (err: any, info: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("Email Sent: " + info.response);
          resolve(info);
        }
      });
    });
    return "Email sent successfully";
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
