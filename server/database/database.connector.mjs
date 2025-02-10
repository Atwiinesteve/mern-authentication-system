import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const dbConnection = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Database connected successfully...");
    })
    .catch((err) => {
      console.log(err);
    });
};
