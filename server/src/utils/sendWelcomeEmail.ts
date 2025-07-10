import { Resend } from 'resend';

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: `Welcome to ${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Welcome to ${process.env.APP_NAME}`,
    html: `
          <p>Hi ${name},</p>
          <p>Welcome to ${process.env.APP_NAME}! We're excited to have you on board.</p>
          <p>Best regards,</p>
          <p>The ${process.env.APP_NAME} Team</p>`,
  });
}
