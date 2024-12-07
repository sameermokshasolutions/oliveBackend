

export const forgetPaswordTemplate = (otp: string) => ({
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Olive Pro Health</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <img src="https://your-logo-url.com/logo.png" alt="Olive Pro Health Logo" style="max-width: 150px; height: auto;">
              <h1 style="color: #2c3e50; margin-top: 20px;">Olive Pro Health</h1>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; padding: 40px; border-radius: 5px;">
              <h2 style="color: #2980b9; margin-bottom: 20px;">Reset Your Password</h2>
              <p style="margin-bottom: 30px;">
                Welcome to Olive Pro Health! We're excited to have you on board. To reset your password, please use the following One-Time Password (OTP):
              </p>
              <p style="font-size: 24px; font-weight: bold; color: #2980b9; margin-bottom: 30px; text-align: center;">
                ${otp}
              </p>
              <p style="margin-bottom: 30px;">
                This OTP is valid for 10 minutes. If you didn't request a password reset, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; text-align: center; font-size: 14px; color: #7f8c8d;">
              <p>&copy; 2023 Olive Pro Health. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
});

// You can add more email templates here as needed

