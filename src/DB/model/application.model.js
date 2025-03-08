import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import { ApplicationStatus } from "../../Constants/index.js";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  CV: {
    secure_url: String,
    public_id: String,
  },
  status: { type: String, enum: Object.values(ApplicationStatus), default: ApplicationStatus.PENDING },
}, { timestamps: true, required: true });

ApplicationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true, // one-to-one relationship
});

ApplicationSchema.virtual("job", {
  ref: "Job",
  localField: "jobId",
  foreignField: "_id",
  justOne: true, // one-to-one relationship
});

ApplicationSchema.set("toObject", { virtuals: true });
ApplicationSchema.set("toJSON", { virtuals: true });

ApplicationSchema.plugin(paginate);

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export { Application };

