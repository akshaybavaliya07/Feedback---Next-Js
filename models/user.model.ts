import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface Message extends Document {
  _id: string;
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "date", updatedAt: false },
  }
);

export interface User extends Document {
    username: string;
    password: string;
    email: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    verificationCode: string;
    verificationCodeExpires: Date;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    verificationCode: {
      type: String,
    },
    verificationCodeExpires: {
      type: Date,
    },
    messages: [MessageSchema],
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);

export default UserModel;