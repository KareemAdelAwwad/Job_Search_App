import { Router } from "express";
import { authentication, errorHandler } from "../../Middleware/index.js";
import * as Services from "./Services/chat.service.js";

const chatRouter = Router();

chatRouter.get("/history/:userId", authentication(), errorHandler(Services.getChatHistory));
chatRouter.get("/connections-list", authentication(), errorHandler(Services.getConnectionsList));

export { chatRouter };

