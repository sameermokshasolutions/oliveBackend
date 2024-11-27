

export const verificationEmailTemplate = (verificationLink: string) => ({
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Olie Pro Health</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <img src="https://your-logo-url.com/logo.png" alt="Olie Pro Health Logo" style="max-width: 150px; height: auto;">
            <h1 style="color: #2c3e50; margin-top: 20px;">Olie Pro Health</h1>
          </td>
        </tr>
        <tr>
          <td style="background-color: #ffffff; padding: 40px; border-radius: 5px;">
            <h2 style="color: #2980b9; margin-bottom: 20px;">Verify Your Email</h2>
            <p style="margin-bottom: 30px;">
            Welcome to Olive Pro Health! We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
            <a href="${verificationLink}" style="display: inline-block; background-color: #2980b9; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">Verify Email</a>
            <p style="margin-top: 30px;">If you didn't create an account with us, please ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 14px; color: #7f8c8d;">
            <p>&copy; 2023 Olie Pro Health. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
});

// You can add more email templates here as needed

