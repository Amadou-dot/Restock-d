import { Resend } from 'resend';

export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  token: string
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const resetLink = `${process.env.CLIENT_URL}/new-password/${token}`;

  try {
    await resend.emails.send({
      from: `Password Reset <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi ${firstName},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>The link is valid for 1 hour</p> 
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>Thank you!</p>
        <p>Best regards,</p>
        <p>Your ${process.env.APP_NAME} Team</p>`,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error(
      'Failed to send password reset email. Please try again later.'
    );
  }
};
