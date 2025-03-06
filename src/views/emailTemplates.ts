export const verificationEmailTemplate = (verificationLink: string) => ({
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Hijr</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <img src="https://your-logo-url.com/logo.png" alt="Hijr Logo" style="max-width: 150px; height: auto;">
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
  `,
});

export const jobAlertTemplate = ({
  jobRole,
  companyName,
  location,
  jobLink,
}: Record<string, string>) => ({
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Alert - Hijr</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f8f8; border-radius: 5px;">
        
          <td style="background-color: #ffffff; padding: 40px; border-radius: 5px;">
            <h2 style="color: #2980b9; margin-bottom: 20px;">🚀 New Job Alert!</h2>
            <p style="margin-bottom: 20px;">We found a job that matches your preferences:</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Job Title:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${jobRole}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Company:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${companyName}</td>
              </tr>
              <tr style="background-color: #f8f8f8;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Location:</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${
                  location || "Not specified"
                }</td>
              </tr>
            </table>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${jobLink}" style="display: inline-block; background-color: #2980b9; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                🔗 View Job & Apply
              </a>
            </div>

            <p style="margin-top: 30px; text-align: center; color: #7f8c8d;">
              If you're not interested in this job, you can ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 14px; color: #7f8c8d;">
            <p>&copy; 2025 Hijr.in. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
});
