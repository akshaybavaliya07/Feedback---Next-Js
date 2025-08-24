import { mailer } from '@/lib/mailer';
import EmailVerification from '@/components/EmailVerificationTemplate';
import { ApiResponse } from '@/types/ApiResponse';
import { render } from '@react-email/render';

export const sendVerificationEmail = async (
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> => {
  try {
    const html = await render(<EmailVerification username={username} otp={otp} />);

    const info = await mailer.sendMail({
      from: `Ghost Whisper <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your Ghost Whisper account',
      html
    });

    console.log("Email sent:", info);

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return {
      success: false,
      message: 'Failed to send verification email. Please try again later.',
    };
  }
};
