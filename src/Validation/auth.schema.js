import Joi from "joi";

export const SignUp = {
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    mobileNumber: Joi.string().min(11).max(11),
    password: Joi.string().min(6),
    gender: Joi.string().valid("Male", "Female"),
    dateOfBirth: Joi.date(),
  }).options({ presence: "required" })
};

export const VerifyEmail = {
  body: Joi.object({
    email: Joi.string().email(),
    OTP: Joi.string().min(6).max(6),
  }).options({ presence: "required" })
};

export const Login = {
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }).options({ presence: "required" })
};

export const ForgotPassword = {
  body: Joi.object({
    email: Joi.string().email(),
  }).options({ presence: "required" })
};

export const ResetPassword = {
  body: Joi.object({
    email: Joi.string().email(),
    OTP: Joi.string().min(6).max(6),
    password: Joi.string().min(6),
  }).options({ presence: "required" })
};

export const RefreshToken = {
  headers: Joi.object({
    refreshtoken: Joi.string().required(),
  }).unknown(true),
};

export const Logout = {
  headers: Joi.object({
    accesstoken: Joi.string(),
    refreshtoken: Joi.string(),
  }).unknown(true).options({ presence: "required" })
};