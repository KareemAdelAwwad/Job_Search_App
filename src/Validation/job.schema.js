import Joi from "joi";
import { JobType, SeniorityLevel } from "../Constants/index.js";

export const GetJobs = {
  params: Joi.object().keys({
    companyName: Joi.string().required().label("Company Name"),
  }),
  headers: Joi.object().keys({
    accesstoken: Joi.string().required().label("Authorization"),
  }).unknown(true),
};

export const AddJob = {
  body: Joi.object().keys({
    title: Joi.string().required().label("Title"),
    description: Joi.string().required().label("Description"),
    type: Joi.string().required().label("Type").valid(...Object.values(JobType)),
    seniorityLevel: Joi.string().required().label("Seniority Level").valid(...Object.values(SeniorityLevel)),
    technicalSkills: Joi.array().items(Joi.string()).required().label("Technical Skills"),
    softSkills: Joi.array().items(Joi.string()).required().label("Soft Skills"),
    location: Joi.string().required().label("Location"),
    companyId: Joi.string().required().label("Company ID"),
  }),
  headers: Joi.object().keys({
    accesstoken: Joi.string().required().label("Authorization"),
  }).unknown(true),
};

export const UpdateJob = {
  params: Joi.object().keys({
    jobId: Joi.string().required().label("Job ID"),
  }),
  body: Joi.object().keys({
    title: Joi.string().label("Title"),
    description: Joi.string().label("Description"),
    type: Joi.string().label("Type").valid(JobType).valid(...Object.values(JobType)),
    seniorityLevel: Joi.string().label("Seniority Level").valid(...Object.values(SeniorityLevel)),
    technicalSkills: Joi.array().items(Joi.string()).label("Technical Skills"),
    softSkills: Joi.array().items(Joi.string()).label("Soft Skills"),
    location: Joi.string().label("Location"),
  }),
  headers: Joi.object().keys({
    accesstoken: Joi.string().required().label("Authorization"),
  }).unknown(true),
};

export const FilterJobs = {
  query: Joi.object().keys({
    title: Joi.string().label("Title"),
    workingTime: Joi.string().label("Type").valid(...Object.values(JobType)),
    seniorityLevel: Joi.string().label("Seniority Level").valid(...Object.values(SeniorityLevel)),
    technicalSkills: Joi.string().label("Technical Skills"),
    softSkills: Joi.string().label("Soft Skills"),
    location: Joi.string().label("Location"),
    offset: Joi.number().label("Offsite"),
    limit: Joi.number().label("Limit"),
  }),
  headers: Joi.object().keys({
    accesstoken: Joi.string().required().label("Authorization"),
  }).unknown(true),
};

export const GetApplications = {
  params: Joi.object().keys({
    jobId: Joi.string().required().label("Job ID"),
  }),
  headers: Joi.object().keys({
    accesstoken: Joi.string().required().label("Authorization"),
  }).unknown(true),
};

export const ApplyJob = {
  params: Joi.object().keys({
    jobId: Joi.string().required().label("Job ID"),
  }),
  headers: Joi.object().keys({
    accesstoken: Joi.string().required().label("Authorization"),
  }).unknown(true),
};

export const UpdateApplication = {
  params: Joi.object().keys({
    applicationId: Joi.string().required().label("Application ID"),
  }),
  query: Joi.object().keys({
    status: Joi.string().required().valid("Accepted", "Rejected").label("Status"),
  }),
  headers: Joi.object().keys({
    accesstoken: Joi.string().required().label("Authorization"),
  }).unknown(true),
};