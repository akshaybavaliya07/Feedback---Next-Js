import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/ApiResponse";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export const POST = async (req: Request) => {
  await dbConnect();
  
  try {
    const { username, password, email } = await req.json();

    const existingUserWithUsername = await UserModel.findOne({ username });
    if (existingUserWithUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists. Please choose a different one.",
        } satisfies ApiResponse,
        {
          status: 400,
        }
      );
    }

    const existingUserWithEmail = await UserModel.findOne({ email });
    if (existingUserWithEmail) {
      return Response.json(
        {
          success: false,
          message: "Email already registered. Please use a different email.",
        } satisfies ApiResponse,
        {
          status: 400,
        }
      );
    }

    const otp = JSON.stringify(Math.floor(100000 + Math.random() * 900000));

    const newUser = new UserModel({
      username,
      password,
      email,
      verificationCode: otp,
      verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    await newUser.save();

    sendVerificationEmail(newUser.email, newUser.username, otp);

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please check your email for verification.",
      } satisfies ApiResponse,
      {
        status: 201,
      }
    ); 
  } catch (error) {
    console.error("Error while registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to register user. Please try again later.",
      } satisfies ApiResponse,
      {
        status: 500,
      }
    );
  }
};