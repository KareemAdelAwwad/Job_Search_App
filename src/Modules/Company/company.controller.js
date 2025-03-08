import { Router } from "express";
import { allowedImageTypes, allowedLegalAttachment } from "../../Constants/index.js";
import { authentication, errorHandler, Multer, Validate } from "../../Middleware/index.js";
import * as Schema from "../../Validation/company.schema.js";
import { jobRouter } from "../Job/job.controller.js";
import * as Service from "./Services/company.services.js";

const companyRouter = Router();

companyRouter.use("/:companyName/jobs", jobRouter);

companyRouter.post("/add",
  authentication(),
  Multer(allowedLegalAttachment).fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
    { name: "legalAttachment", maxCount: 1 }
  ]),
  errorHandler(Service.AddCompany));

companyRouter.put("/update/:companyId",
  authentication(),
  Multer(allowedImageTypes).fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  errorHandler(Service.UpdateCompany));

companyRouter.delete("/delete/:companyId", Validate(Schema.DeleteCompany), authentication(), errorHandler(Service.DeleteCompany));
companyRouter.get("/:companyName", Validate(Schema.GetCompanyByName), authentication(), errorHandler(Service.GetCompanyByName));
companyRouter.get("/jobs/:companyId", Validate(Schema.GetCompanyJobs), authentication(), errorHandler(Service.GetCompanyJobs));

companyRouter.post("/upload-logo/:companyId", authentication(), Multer(allowedImageTypes).single("logo"), errorHandler(Service.UploadLogo));
companyRouter.post("/upload-cover/:companyId", authentication(), Multer(allowedImageTypes).single("cover"), errorHandler(Service.UploadCover));
companyRouter.delete("/delete-logo/:companyId", authentication(), errorHandler(Service.DeleteLogo));
companyRouter.delete("/delete-cover/:companyId", authentication(), errorHandler(Service.DeleteCover));

companyRouter.get("/applications/:companyId", errorHandler(Service.ExportTOExcel));
// I didn't add the authentication middleware here because I want you to be able to test it the borwser without headache.

export { companyRouter };

