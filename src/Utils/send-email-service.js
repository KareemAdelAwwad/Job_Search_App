import { config } from "dotenv";
import { EventEmitter } from "events";
import nodemailer from "nodemailer";
import * as Tamplate from "./email-template.js";
config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const emailEvent = new EventEmitter();

transporter.verify((error) => {
  if (error) {
    console.log("🚫 Error in email connection", error);
  } else {
    console.log("📧 Email Connected!");
  }
});

emailEvent.on("confirmation", async (data) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      cc: process.env.EMAIL,
      to: data.email,
      subject: data.subject || "Email Confirmation OTP",
      text: `Hello ${data.userName}, Your OTP is ${data.OTP}`,
      html: Tamplate.emailConfimation(data.userName, data.OTP)
    });
  } catch (error) {
    console.log("🚫 Error in sending email", error);
  }
});

emailEvent.on("forgot-password", async (data) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      cc: process.env.EMAIL,
      to: data.email,
      subject: data.subject || "Forgot Password OTP",
      text: `Hello ${data.userName}, Your OTP is ${data.OTP}`,
      html: Tamplate.forgetPassword(data.userName, data.OTP)
    });
  } catch (error) {
    console.log("🚫 Error in sending email", error);
  }
});

emailEvent.on("password-changed", async (data) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      cc: process.env.EMAIL,
      to: data.email,
      subject: data.subject || "Password Changed",
      text: `Hello ${data.userName}, Your Password has been changed successfully!`,
      html: Tamplate.passwordChanged(data.userName, data.timestamp)
    });
  } catch (error) {
    console.log("🚫 Error in sending email", error);
  }
});

emailEvent.on("application-accepted", async (data) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      cc: process.env.EMAIL,
      to: data.email,
      subject: data.subject || "Application Accepted",
      text: `Hello ${data.userName}, Your application has been accepted!`,
      html: Tamplate.acceptanceEmail(data.userName, data.jobTitle, data.companyName, data.companyEmail)
    });
  } catch (error) {
    console.log("🚫 Error in sending email", error);
  }
});

emailEvent.on("application-rejected", async (data) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      cc: process.env.EMAIL,
      to: data.email,
      subject: data.subject || "Application Rejected",
      text: `Hello ${data.userName}, Your application has been rejected!`,
      html: Tamplate.rejectionEmail(data.userName, data.jobTitle, data.companyName)
    });
  } catch (error) {
    console.log("🚫 Error in sending email", error);
  }
});