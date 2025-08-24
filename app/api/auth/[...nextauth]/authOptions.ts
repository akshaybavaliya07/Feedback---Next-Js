import UserModel from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1️⃣ Credentials Provider (Custom Login Logic)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          }).lean();

          if (!user) throw new Error("User not found");

          if (!user.isVerified) {
            throw new Error(
              `UNVERIFIED:${user.username}: User not verified. Please verify your account.`
            );
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValidPassword) throw new Error("Invalid password");

          return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
          };
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : String(error)
          );
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.email = token.email as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
