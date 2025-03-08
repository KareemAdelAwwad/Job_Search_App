import { Router } from "express";
import { errorHandler, Validate } from "../../Middleware/index.js";
import * as Services from "./Services/auth.service.js";
import * as Schema from "../../Validation/auth.schema.js";

const authRouter = Router();

authRouter.post("/signup", Validate(Schema.SignUp), errorHandler(Services.SignUp));
authRouter.post("/verify-email", Validate(Schema.VerifyEmail),errorHandler(Services.VerifyEmail));
authRouter.post("/login", Validate(Schema.Login),errorHandler(Services.Login));
authRouter.post("/forgot-password", Validate(Schema.ForgotPassword),errorHandler(Services.ForgotPassword));
authRouter.patch("/reset-password", Validate(Schema.ResetPassword),errorHandler(Services.ResetPassword));
authRouter.post("/refresh-token", Validate(Schema.RefreshToken),errorHandler(Services.RefreshToken));
authRouter.post("/logout", Validate(Schema.Logout),errorHandler(Services.Logout));
/*-------------Google Auth-------------*/
authRouter.post("/gmail-signup", errorHandler(Services.GoogleAuth)); // Only One Service that handles both signup and login ✨

export { authRouter };

