import mongoose from "mongoose";
import { UserModel } from "../models/userSchema.js";

export const connectDB = async (startServerFn) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected successfully");
    UserModel.syncIndexes(); // this will sync the indexes in the schema with the mongodb.
    startServerFn();
  } catch (error) {
    console.error("error in DB connection: ", error);
  }
};
