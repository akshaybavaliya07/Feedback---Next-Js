import {DefaultSession} from "next-auth";

declare module "next-auth" {
    interface User {
        _id: string;
        username: string;
        email: string;
        isVerified: boolean;
        isAcceptingMessages: boolean;
    }

    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            isVerified: boolean;
            isAcceptingMessages: boolean;
        };
    }

    interface JWT {
        id: string;
        username: string;
        email: string;
        isVerified: boolean;
        isAcceptingMessages: boolean;
    }
}