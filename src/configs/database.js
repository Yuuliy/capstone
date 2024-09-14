import mongoose from "mongoose";
import { DATABASE_URI } from "../constants/env.js";

export const connection = async () => {

  await mongoose.connect(DATABASE_URI);

  const state = Number(mongoose.connection.readyState);
  console.log(state === 1 ? "Connected to mongodb" : "Failed to connect");
};
