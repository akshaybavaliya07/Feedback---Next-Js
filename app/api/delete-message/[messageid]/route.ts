import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import UserModel from "@/models/user.model";

export const DELETE = async (
  req: Request,
  { params }: { params: { messageid: string } }
) => {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated!",
      },
      {
        status: 401,
      }
    );
  }

  const messageId = params.messageid;

  try {
    const updatedMessages = await UserModel.updateOne(
      { _id: session.user.id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedMessages.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted.",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while deleting the message.",
      },
      {
        status: 500,
      }
    );
  }
};
