//Configuration for connecting to MongoDB database

import dotenv from "dotenv";
dotenv.config({ quiet: true });

import mongoose from "mongoose";
import { logger } from "./logger.config.js";

export default function mongoSetup(): void {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() =>
      // logger.info(`Connected to MongoDB at ${process.env.MONGODB_URI}`)
      logger.info(`Connected to MongoDB`)
    )
    .catch((err) => {
      logger.error(err);
      process.exit(1);
    });
}
