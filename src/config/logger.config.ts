// Configuration for Pino-Pretty Logger
// Used for logging in console and writing to file

import { type Application } from "express";
import fs from "fs";
import morgan from "morgan";
import { pino, multistream } from "pino";
import pretty from "pino-pretty";

// Ensure logs directory exists
// if (!fs.existsSync("./logs")) {
//   fs.mkdirSync("./logs");
// }
// // Create logs files if they don't exist
// if (!fs.existsSync("./logs/app.log")) {
//   fs.writeFileSync("./logs/app.log", "");
// }
// if (!fs.existsSync("./logs/access.log")) {
//   fs.writeFileSync("./logs/access.log", "");
// }

// Pretty stream for console
const prettyStream = pretty({
  colorize: true,
  translateTime: "yyyy-mm-dd HH:MM:ss",
  ignore: "pid,hostname"
});

// const streams = [
//   { stream: fs.createWriteStream("./logs/app.log", { flags: "a" }) },
//   { stream: prettyStream }
// ];

export const logger = pino(
  { level: "info" },
  prettyStream
);

export default function loggerSetup(app: Application): void {
  app.use(morgan("dev"));
  morgan("combined", {
      stream: {
        write: (message) => {
          logger.info(message.trim()); // send morgan logs to pino
        }
      }
  });
}
