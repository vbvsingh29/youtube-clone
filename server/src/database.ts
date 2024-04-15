import mongoose, { mongo } from "mongoose";
import logger from "./utils/logger";
import { DB_CONNECTION_STRING } from "./utils/constants";

export async function connectToDatabase() {
  try {
    await mongoose.connect(DB_CONNECTION_STRING as string);
    logger.info("Connected to Database");
  } catch (e: any) {
    logger.error(e, "Failed to Connect Database");
  }
}

export async function disconnectFromDatabse() {
  await mongoose.connection.close();

  logger.info("Disconnected from Database");
}
