import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { AuthProvider, OTPType, Roles } from "../../Constants/index.js";
import { Decypt, Encrypt } from "../../Utils/index.js";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  provider: {
    type: String,
    enum: Object.values(AuthProvider),
    default: AuthProvider.SYSTEM,
  },
  gender: { type: String, enum: ["Male", "Female"] },
  dateOfBirth: Date,
  mobileNumber: String,
  role: { type: String, enum: Object.values(Roles), default: Roles.USER },
  isConfirmed: { type: Boolean, default: false },
  deletedAt: Date,
  bannedAt: Date,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changeCredentialTime: Date,
  profilePic: {
    secure_url: String,
    public_id: String,
  },
  coverPic: {
    secure_url: String,
    public_id: String,
  },
  OTP: [{
    code: { type: String, require: true },
    type: { type: String, enum: Object.values(OTPType), require: true },
    expireAt: { type: Date, require: true },
  }]
}, { timestamps: true });

// username virtual
UserSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Relationships
UserSchema.virtual("Jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "createdBy"
});

UserSchema.virtual("Applications", {
  ref: "Application",
  localField: "_id",
  foreignField: "userId"
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

// Hooks
UserSchema.post("deleteOne", async function (doc) {
  await mongoose.models.Application.deleteMany({ userId: doc._id });
  await mongoose.models.Job.deleteMany({ createdBy: doc._id });
  await mongoose.models.Company.updateMany(
    { HRs: doc._id },
    { $pull: { HRs: doc._id } }
  );
  await mongoose.models.Company.deleteMany({ createdBy: doc._id });
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUNDS);
  }

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = Encrypt(this.mobileNumber, process.env.ENCRYPTION_KEY);
  }
  next();
});

UserSchema.post("findOne", async function (doc) {
  if (doc && doc.mobileNumber) {
    doc.mobileNumber = Decypt(doc.mobileNumber, process.env.ENCRYPTION_KEY);
  }
});
UserSchema.post("find", async function (docs) {
  docs.forEach(doc => {
    if (doc.mobileNumber) {
      doc.mobileNumber = Decypt(doc.mobileNumber, process.env.ENCRYPTION_KEY);
    }
  });
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export { User };

