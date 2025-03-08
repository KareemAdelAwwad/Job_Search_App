import mongoose from "mongoose";
import { NumberOfEmployees } from "../../Constants/index.js";

const CompanySchema = new mongoose.Schema({
  name: { type: String, uniqu: true, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  address: { type: String, required: true },
  numberOfEmployees: { type: String, enum: Object.values(NumberOfEmployees), required: true },
  email: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  logo: {
    secure_url: String,
    public_id: String,
  },
  cover: {
    secure_url: String,
    public_id: String,
  },
  HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  legalAttachment: {
    secure_url: String,
    public_id: String,
  },
  approvedByAdmin: { type: Boolean, default: false },
  deletedAt: Date,
  bannedAt: Date,
}, { timestamps: true });

// Virtual populate
CompanySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "companyId",
  justOne: false, // one-to-many relationship
});

CompanySchema.set("toObject", { virtuals: true });
CompanySchema.set("toJSON", { virtuals: true });

const Company = mongoose.models.Company || mongoose.model("Company", CompanySchema);
export { Company };

