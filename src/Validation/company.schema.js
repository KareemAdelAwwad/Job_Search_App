import Joi from "joi";

export const DeleteCompany = {
  params: Joi.object({
    companyId: Joi.string().required()
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};

export const GetCompanyJobs = {
  params: Joi.object({
    companyId: Joi.string().required()
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};

export const GetCompanyByName = {
  params: Joi.object({
    companyName: Joi.string().required()
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};