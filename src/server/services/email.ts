import { MailtrapClient } from "mailtrap";
import { env } from "~/env";

const client = new MailtrapClient({
    token: env.MAILTRAP_TOKEN,
});

const sender = {
    email: env.MAILTRAP_SENDER_EMAIL,
    name: env.MAILTRAP_SENDER_NAME,
};

/**
 * Send an email using Mailtrap
 */
export const sendEmail = async (
    recipientEmail: string,
    subject: string,
    textContent: string,
    htmlContent?: string
) => {
    const recipients = [{ email: recipientEmail }];

    try {
        const result = await client.send({
            from: sender,
            to: recipients,
            subject,
            text: textContent,
            html: htmlContent || textContent,
            category: "Vendora",
        });

        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

/**
 * Send a verification email
 */
export const sendVerificationEmail = async (
    recipientEmail: string,
    verificationCode: string
) => {
    const subject = "Verify your Vendora account";
    const textContent = `Your verification code is: ${verificationCode}`;
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a56db;">Verify your Vendora account</h1>
      <p>Thank you for registering with Vendora. To complete your verification, please use the following code:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
        <h2 style="color: #1a56db; margin: 0;">${verificationCode}</h2>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    </div>
  `;

    return sendEmail(recipientEmail, subject, textContent, htmlContent);
};

/**
 * Send a password reset email
 */
export const sendPasswordResetEmail = async (
    recipientEmail: string,
    resetToken: string
) => {
    const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/password/reset/${resetToken}`;
    const subject = "Reset your Vendora password";
    const textContent = `Click here to reset your password: ${resetUrl}`;
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #1a56db;">Reset your Vendora password</h1>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetUrl}" style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
    </div>
  `;

    return sendEmail(recipientEmail, subject, textContent, htmlContent);
}; 