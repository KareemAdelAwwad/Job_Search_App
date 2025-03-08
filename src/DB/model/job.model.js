import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { JobStatus, JobType, SeniorityLevel } from "../../Constants/index.js";

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: Object.values(JobType) }, // workingTime 
  seniorityLevel: { type: String, enum: Object.values(SeniorityLevel) },
  technicalSkills: [String],
  softSkills: [String],
  location: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: Object.values(JobStatus), default: JobStatus.ACTIVE },
  deletedAt: { type: Date, required: false },
}, { timestamps: true, required: true });

JobSchema.virtual("applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "jobId",
  justOne: false, // one-to-many relationship
});

JobSchema.set("toObject", { virtuals: true });
JobSchema.set("toJSON", { virtuals: true });

JobSchema.plugin(paginate);

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
export { Job };

