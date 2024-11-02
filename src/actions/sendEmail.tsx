"use server";
import nodemailer from "nodemailer";
import action_updateCallDetails from "./updateCallDetails";

const sendMail = async (email: string, callid: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Feedback Matters</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #ffffff; color: #333333; line-height: 1.6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 0;">
                <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; border: 1px solid #e0e0e0; border-spacing: 0; text-align: left;">
                    <tr>
                        <td align="center" style="padding: 30px 0; background-color: #000000;">
                            <h1 style="font-size: 24px; margin: 0; color: #ffffff; font-weight: normal;">Your Feedback Matters</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px;">Hello,</p>
                            <p style="margin: 0 0 20px 0; font-size: 16px;">We value your opinion and would love to hear your thoughts. Your feedback helps us improve our services.</p>
                            <p style="margin: 0 0 30px 0; font-size: 16px;">Please take a moment to share your experience with us.</p>
                            <table role="presentation" style="border-collapse: collapse; border: 0; border-spacing: 0; margin: 0 auto;">
                                <tr>
                                    <td align="center" style="border-radius: 4px;" bgcolor="#000000">
                                        <a href="${process.env.FE_URL}/feedback/${callid}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 4px; padding: 12px 25px; border: 1px solid #000000; display: inline-block; font-weight: bold;">Give Feedback</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; background-color: #f8f8f8; font-size: 14px; text-align: center; color: #666666;">
                            <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

  const mailOptions = {
    from: `"P101" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "PP:101 CXP Customer Feedback",
    html: html,
  };

  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return rej();
      }
      console.log("Message sent: %s", info.messageId);
      action_updateCallDetails(callid, { emailSent: true });
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return res(true);
    });
  });
};

export default sendMail;
