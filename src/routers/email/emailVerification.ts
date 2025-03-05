import express, { Request, Response } from "express";
import { verifyEmail } from "../user/userController/registerController";
import { emailService } from "../../services/emailService";
import { verificationEmailTemplate } from "../../views/emailTemplates";

const emailRouter = express.Router();

emailRouter.post("/verify-email", verifyEmail);

// Controller function to send test email
const sendTestEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text } = req.body;

    emailService.sendEmail(to, subject, verificationEmailTemplate(text));
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      ...req.body,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send email", error });
  }
};
emailRouter.post("/email", sendTestEmail);

export default emailRouter;
