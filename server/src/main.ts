import express, { Request, Response } from "express";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { connectToDatabase, disconnectFromDatabse } from "./database";
import { CORS_ORIGIN, PORT } from "./utils/constants";
import userRoute from "./modules/user/user.route";
import authRoute from "./modules/auth/auth.route";
import videoRoute from "./modules/videos/video.route";
import deserializeUser from "./middleware/deserializeUser";
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use((req, res, next) => {
  const origin = CORS_ORIGIN || 'https://youtube-clone-1-zebi.onrender.com';
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN || "");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(deserializeUser);

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/videos", videoRoute);

app.get("/healthcheck", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send("I am up");
});

const server = app.listen(PORT, async () => {
  await connectToDatabase();
  logger.info(`server is listening at http://localhost:${PORT}`);
});

const signals = ["SIGTERM", "SIGINT"];

function gracefulShutDown(signal: string) {
  process.on(signal, async () => {
    logger.info("Adios Amigo, Got Signal", signal);
    server.close();
    await disconnectFromDatabse();
    process.exit(0);
  });
}
for (let i = 0; i < signals.length; i++) {
  gracefulShutDown(signals[i]);
}
