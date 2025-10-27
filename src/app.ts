import cors from "cors";
import express from "express";

import loggerSetup, { logger } from "./config/logger.config.js";
import mongoSetup from "./config/mongodb.config.js";
import swaggerSetup from "./config/swagger.config.js";
import router from "./routes/main.routes.js";
import { notFound } from "./controllers/misc.controller.js";
// import passportSetup from "./config/passport.config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

loggerSetup(app);
mongoSetup();
// passportSetup(app);
swaggerSetup(app);
app.use("/api/v1", router);
app.use(notFound);

const port = process.env.PORT || 4650;

app.listen(port, () =>
  logger.info(`Server running on http://localhost:${port}`)
);
