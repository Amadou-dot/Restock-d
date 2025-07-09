import { Resend } from 'resend';

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: `Welcome to ${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Welcome to Shop',
    html: `
          <p>Hi ${name},</p>
          <p>Welcome to Shop! We're excited to have you on board.</p>
          <p>Best regards,</p>
          <p>The Shop Team</p>`,
  });
}
