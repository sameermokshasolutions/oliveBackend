import express, { Request, Response } from "express";
import { verifyEmail } from "../user/userController/registerController";

const emailRouter = express.Router();

emailRouter.post("/verify-email", verifyEmail);

import nodemailer from "nodemailer";
import { config } from "../../config/config";

// Configure the Yandex SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.yandex.com", // Yandex SMTP server
  port: 465, // Use 465 for SSL, 587 for TLS
  secure: true, // True for port 465, false for 587
  auth: {
    user: config.emailUser, // Your Yandex email
    pass: config.emailPassword, // Your Yandex email password or app password
  },
});

// Controller function to send test email
const sendTestEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text } = req.body; // Get recipient details from request body

    // Email options
    const mailOptions = {
      from: config.emailUser,
      to: to || "skzee81@gmail.com", // Use provided email or default
      subject: subject || "Test Email",
      text: text || "This is a test email from Yandex SMTP!",
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!", info });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send email", error });
  }
};
emailRouter.post("/email", sendTestEmail);

export default emailRouter;
