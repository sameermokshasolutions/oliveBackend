import nodemailer from "nodemailer";
import { EmailTemplate } from "../types/emailTemplate";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: EmailTemplate
  ): Promise<void> {
    const mailOptions = {
      from: `"Olie Pro Health" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: template.html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
