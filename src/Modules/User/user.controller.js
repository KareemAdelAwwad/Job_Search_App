import { Router } from "express";
import { allowedImageTypes } from "../../Constants/index.js";
import { authentication, errorHandler, Multer, Validate } from "../../Middleware/index.js";
import * as Schema from "../../Validation/user.schema.js";
import * as Services from "./Services/user.services.js";

const userRouter = Router();

userRouter.post("/update", Validate(Schema.UpdateUserAccount), authentication(), errorHandler(Services.UpdateUserAccount));
userRouter.get("/account", Validate(Schema.GetUserAccount), authentication(), errorHandler(Services.GetUserAccount));
userRouter.get("/view-profile/:userId", Validate(Schema.GetUserProfile), authentication(), errorHandler(Services.GetUserProfile));
userRouter.patch("/change-password", Validate(Schema.ChangePassword), authentication(), errorHandler(Services.ChangePassword));
userRouter.delete("/delete-account", Validate(Schema.SoftDeleteAccount), authentication(), errorHandler(Services.SoftDeleteAccount));
/*-----------------Image Uploading-----------------*/
userRouter.post("/upload-profile-pic",
  authentication(), Multer(allowedImageTypes).single("profilePic"),
  errorHandler(Services.UploadProfilePic));

userRouter.post("/upload-cover-pic",
  authentication(), Multer(allowedImageTypes).single("coverPic"),
  errorHandler(Services.UploadCoverPic));

userRouter.delete("/delete-profile-pic", authentication(), errorHandler(Services.DeleteProfilePic));
userRouter.delete("/delete-cover-pic", authentication(), errorHandler(Services.DeleteCoverPic));

export { userRouter };

