import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export const GET = async () => {
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

  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const userWithMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true }},
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userWithMessages || userWithMessages.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: userWithMessages[0].messages,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "An error occurred while fetching messages",
      },
      { status: 500 }
    );
  }
};
