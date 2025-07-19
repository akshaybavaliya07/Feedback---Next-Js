import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import UserModel from "@/models/user.model";

export const POST = async (req: Request) => {
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

  const { isAcceptingMessages } = await req.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { isAcceptingMessages },
      { new: true }
    );

    return Response.json(
      {
        success: true,
        message: "Accepting messages status updated successfully",
        data: { isAcceptingMessages: updatedUser?.isAcceptingMessages },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "failed to update accepting messages status",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async (req: Request) => {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  const user = await UserModel.findOne({ username });
  if (!user) {
    return Response.json(
      {
        success: false,
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  return Response.json(
    {
      success: true,
      message: "User found",
      data: { isAcceptingMessages: user.isAcceptingMessages },
    },
    {
      status: 200,
    }
  );
};
