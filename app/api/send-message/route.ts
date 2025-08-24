import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { Message } from "@/models/user.model";

export const POST = async (req: Request) => {
  await dbConnect();
  const { message, sendTo } = await req.json();
  try {
    const user = await UserModel.findOne({ username: sendTo });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: `User not found with username ${sendTo}`,
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: `User ${sendTo} is not accepting messages`,
        },
        { status: 403 }
      );
    }

    const newMessage = { content: message.trim(), createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "An error occurred while sending the message",
      },
      { status: 500 }
    );
  }
};
