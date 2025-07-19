import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const POST = async (req: Request) => {
    await dbConnect();

    try {
        const { username } = await req.json();

        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found.",
                },
                {
                    status: 404,
                }
            );
        }

        const newVerificationCode = JSON.stringify(Math.floor(100000 + Math.random() * 900000));
        user.verificationCode = newVerificationCode;
        user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        sendVerificationEmail(user.email, user.username, newVerificationCode);

        return Response.json(
            {
                success: true,
                message: "New verification code sent to the user's email.",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "An error occurred while checking the email.",
            },
            {
                status: 500,
            }
        );
    }
};