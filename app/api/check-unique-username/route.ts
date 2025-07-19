import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export const GET = async (req: Request) => {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        const existingUser = await UserModel.findOne({ username });
        if(existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 409,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is available.",
            },
            {
                status: 200,
            }
        );
        
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "An error occurred while checking the username.",
            },
            {
                status: 500,
            }
        );
        
    }
}