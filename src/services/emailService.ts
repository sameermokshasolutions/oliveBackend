import nodemailer from "nodemailer";
import { EmailTemplate } from "../types/emailTemplate";
import { config } from "../config/config";
// {
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     }
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.yandex.com", // Yandex SMTP server
      port: 465, // Use 465 for SSL, 587 for TLS
      secure: true, // True for port 465, false for 587
      auth: {
        user: config.emailUser, // Your Yandex email
        pass: config.emailPassword, // Your Yandex email password or app password
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    template: EmailTemplate
  ): Promise<void> {
    const mailOptions = {
      from: `"Hijr" <${config.emailUser}>`,
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
