import { config } from "dotenv";
config();

import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { createHandler } from "graphql-http/lib/use/express";
import helmet from "helmet";
import { Server } from "socket.io";

import { WhiteListedDomains } from "./Constants/index.js";
import connectDB from "./DB/connection.js";
import mainSchema from "./GraphQL/main.schema.js";
import { DeleteExpiredTokens, DeletingExpiredOTP, establishIoConnection, routes } from "./Utils/index.js";

const corsOptions = {
  origin: (origin, callback) => {
    if (WhiteListedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

///////////////////////////////////////////////////
const app = express();
const server = app.listen(process.env.PORT, () => {
  console.log(`🖥️  Server is running on port ${process.env.PORT}`);
});

export const io = new Server(server, {
  cors: {
    origin: [...WhiteListedDomains],
    credentials: true
  }
});

export const bootstrap = async () => {
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(limiter);

  routes(app);
  app.use("/graphql", createHandler({ schema: mainSchema }));
  await connectDB();

  DeletingExpiredOTP();
  DeleteExpiredTokens();

  server;
  io;
  establishIoConnection(io);
};

export default bootstrap;