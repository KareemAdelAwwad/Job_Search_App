import Joi from "joi";

export const UpdateUserAccount = {
  body: Joi.object({
    mobileNumber: Joi.string().min(11).max(11),
    dateOfBirth: Joi.date(),
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    gender: Joi.string().valid("Male", "Female")
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};

export const GetUserAccount = {
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};

export const GetUserProfile = {
  params: Joi.object({
    userId: Joi.string().required()
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};

export const ChangePassword = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};

export const SoftDeleteAccount = {
  headers: Joi.object({
    accesstoken: Joi.string().required()
  }).unknown(true)
};