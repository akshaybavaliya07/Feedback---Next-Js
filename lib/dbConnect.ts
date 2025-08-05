import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }
  try {
    const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}` || "");
    connection.isConnected = connect.connections[0].readyState;
    console.log("Database connected successfully ✅");
  } catch (error) {
    console.log("Database connection failed ❌", error);
    process.exit(1);
  }
};

export default dbConnect;