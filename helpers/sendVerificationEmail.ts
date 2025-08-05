import { resend } from '@/lib/resend';
import VerificationEmailTemplate from '@/components/EmailVerification-template';
import { ApiResponse } from '@/helpers/ApiResponse';

export const sendVerificationEmail = async (email:string, username:string, otp:string): Promise<ApiResponse> => {
    try {
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'bavaliyaakshay1111@gmail.com', // email - sent to user email
            subject: 'Verification Email',
            react: VerificationEmailTemplate({ username, otp }),
        });

        console.log("📧 Resend Email Response: ", result);

        return {
            success: true,
            message: 'Verification email sent successfully.',
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: 'Failed to send verification email. Please try again later.',
        };
        
    }
}