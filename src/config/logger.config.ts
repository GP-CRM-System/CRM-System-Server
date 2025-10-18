// Configuration for Pino-Pretty Logger
// Used for logging in console and writing to file

import { type Application } from "express";
import fs from "fs";
import morgan from "morgan";
import { pino, multistream } from "pino";
import pretty from "pino-pretty";

// Pretty stream for console
const prettyStream = pretty({
  colorize: true,
  translateTime: "yyyy-mm-dd HH:MM:ss",
  ignore: "pid,hostname",
});

const streams = [
  { stream: fs.createWriteStream("./logs/app.log", { flags: "a" }) },
  { stream: prettyStream },
];

export const logger = pino(
  { level: "info" },
  multistream(streams)
);

export default function loggerSetup(app: Application): void {
  app.use(morgan("dev"));
  app.use(morgan("combined", {
    stream: fs.createWriteStream("./logs/access.log", { flags: "a" })
  }));
}