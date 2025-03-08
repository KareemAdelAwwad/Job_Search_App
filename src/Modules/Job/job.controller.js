import { Router } from "express";
// import { companyRouter } from "../index.js";
import { Roles } from "../../Constants/index.js";
import { authentication, authorization, errorHandler, Multer, Validate } from "../../Middleware/index.js";
import * as Schema from "../../Validation/job.schema.js";
import * as Service from "./Services/job.services.js";
const jobRouter = Router({ mergeParams: true });

jobRouter.get("/", Validate(Schema.GetJobs), authentication(), errorHandler(Service.GetJobs));
jobRouter.post("/add", Validate(Schema.AddJob), authentication(), errorHandler(Service.AddJob));
jobRouter.put("/update/:jobId", Validate(Schema.UpdateJob), authentication(), errorHandler(Service.UpdateJob));
jobRouter.delete("/delete/:jobId", authentication(), errorHandler(Service.DeleteJob));

jobRouter.get("/filter", Validate(Schema.FilterJobs), authentication(), errorHandler(Service.FilterJobs));
jobRouter.get("/applications/:jobId", Validate(Schema.GetApplications), authentication(), errorHandler(Service.GetApplications));
jobRouter.post("/apply/:jobId", Validate(Schema.ApplyJob), authentication(), authorization(Roles.USER), Multer("application/pdf").single("CV"), errorHandler(Service.ApplyJob));
jobRouter.put("/update-application/:applicationId", Validate(Schema.UpdateApplication), authentication(), errorHandler(Service.ApplicationStatusUpdate));

export { jobRouter };

