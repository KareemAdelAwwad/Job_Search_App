import cloudinary from "../../../config/cloudinary.js";
import { ApplicationStatus, JobStatus, Roles } from "../../../Constants/index.js";
import { Application, Company, Job } from "../../../DB/index.js";
import { emailEvent, socketConnictions } from "../../../Utils/index.js";
import { io } from "../../../main.js";

const checkCompanyPermission = async (company, userId, userRole) => {
  // Check if user is admin
  if (userRole === Roles.ADMIN) return true;
  // Check if user is owner
  if (company.createdBy.toString() === userId.toString()) return true;
  // Check if user is HR
  if (company.HRs.includes(userId)) return true;

  return false;
};

export const GetJobs = async (req, res) => {
  const { companyName } = req.params;
  if (!companyName || companyName === ":companyName") return res.status(400).json({ message: "❗Company ID is required" });

  const company = await Company.findOne({ name: companyName });
  if (!company) return res.status(404).json({ message: "❗Company not found" });
  const jobs = await Job.paginate({ companyId: company._id, status: JobStatus.ACTIVE, deletedAt: null });
  return res.status(200).json({ jobs });
};

export const AddJob = async (req, res) => {
  const { title, description, type, seniorityLevel, technicalSkills, softSkills, location, companyId } = req.body;
  const { _id: createdBy, role } = req.user;
  console.log("Body", req.body);
  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ message: "❗Company not found" });
  const isAllowed = await checkCompanyPermission(company, createdBy, role);
  if (!isAllowed) return res.status(401).json({ message: "You are not allowed to add job to this company" });

  const job = new Job({
    title,
    description,
    type,
    seniorityLevel,
    technicalSkills,
    softSkills,
    location,
    companyId,
    createdBy
  });
  await job.save();
  return res.status(201).json({ message: "✅ Job added successfully", job });
};

export const UpdateJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, description, type, seniorityLevel, technicalSkills, softSkills, location } = req.body;
  const { _id: updatedBy, role } = req.user;

  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: "❗Job not found" });

  const company = await Company.findById(job.companyId);
  if (!company) return res.status(404).json({ message: "❗Company not found" });
  const isAllowed = await checkCompanyPermission(company, updatedBy, role);
  if (!isAllowed) return res.status(401).json({ message: "You are not allowed to update job to this company" });

  const updateJob = await Job.findByIdAndUpdate(jobId,
    { title, description, type, seniorityLevel, technicalSkills, softSkills, location, updatedBy }, { new: true });

  return res.status(200).json({ message: "✅ Job updated successfully", job: updateJob });
};

export const DeleteJob = async (req, res) => {
  const { jobId } = req.params;
  const { _id, role } = req.user;
  const job = await Job.findById(jobId);
  if (!job) return res.status(404).json({ message: "❗Job not found" });
  const isAllowed = await checkCompanyPermission(job.companyId, _id, role);
  if (!isAllowed) return res.status(401).json({ message: "You are not allowed to delete job to this company" });

  await Job.findByIdAndUpdate(jobId, { deletedAt: new Date() });
  return res.status(200).json({ message: "✅ Job deleted successfully" });
};

export const FilterJobs = async (req, res) => {
  const { offset, limit, workingTime, location, seniorityLevel, title, technicalSkills } = req.query;

  const regexOptions = (target) => ({ $regex: target, $options: "i" });
  const filterQuery = {
    status: JobStatus.ACTIVE,
    deletedAt: null,
    ...(workingTime && { type: regexOptions(workingTime) }),
    ...(location && { location: regexOptions(location) }),
    ...(seniorityLevel && { seniorityLevel: regexOptions(seniorityLevel) }),
    ...(title && { title: regexOptions(title) }),
    ...(technicalSkills && { technicalSkills: { $in: technicalSkills.split(",") } })
  };

  const jobs = await Job.paginate(filterQuery, { offset, limit });

  res.status(200).json({ jobs });
};

export const GetApplications = async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) return res.status(400).json({ message: "❗Job ID is required" });
  const { companyId: company } = await Job.findById(jobId).populate("companyId");
  const isAllowed = await checkCompanyPermission(company, req.user._id, req.user.role);
  if (!isAllowed) return res.status(401).json({ message: "You are not allowed to view applications to this job" });

  const applications = await Application.paginate({ jobId }, {
    populate: {
      path: "user",
      select: "-_id firstName lastName email profilePic gender mobileNumber dateOfBirth"
    }
  });
  return res.status(200).json({ applications });
};

export const ApplyJob = async (req, res) => {
  const { jobId } = req.params;
  const { _id: userId } = req.user;
  let CV = req.file;
  const job = await Job.findById(jobId).populate("applications");
  if (!job) return res.status(404).json({ message: "❗Job not found" });
  if (job.status !== JobStatus.ACTIVE) return res.status(400).json({ message: "❗Job is not active" });
  if (!CV) return res.status(400).json({ message: "❗CV is required" });
  if (job.applications.find((app) => app.userId.toString() === userId.toString())) {
    return res.status(400).json({ message: "❗You have already applied to this job" });
  }
  const company = await Company.findById(job.companyId);

  await cloudinary().uploader.upload(CV.path, { folder: `${process.env.FOLDER_NAME}/CVs/${jobId}` }, (error, result) => {
    if (error) return res.status(500).json({ message: "❗Failed to upload CV" });
    CV = { secure_url: result.secure_url, public_id: result.public_id };
  });

  await Application.create({ jobId, userId, CV });
  // Notify HRs via Socket.io
  const message = `📩 New application received for ${job.title}`;
  const HRs = company.HRs;
  HRs.forEach((HR) => {
    const socketId = socketConnictions.get(HR.toString());
    if (socketId) {
      io.to(socketId).emit("HRNotification", { message });
    }
  });

  return res.status(200).json({ message: "✅ Job applied successfully" });
};

export const ApplicationStatusUpdate = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.query;
  const { _id: userId, role } = req.user;
  const application = await Application.findById(applicationId).populate([
    { path: "job", select: "title companyId" },
    { path: "user", select: "email firstName" }
  ]);

  if (!applicationId) return res.status(400).json({ message: "❗Application ID is required" });
  if (!application) return res.status(404).json({ message: "❗Application not found" });
  if (application.status !== ApplicationStatus.PENDING) return res.status(400).json({ message: "❗Application is already processed" });
  const company = await Company.findById(application.job.companyId);
  const isAllowed = await checkCompanyPermission(company, userId, role);
  if (!isAllowed) return res.status(401).json({ message: "You are not allowed to update applications to this job" });

  const { email, firstName } = application.user;
  if (status === ApplicationStatus.ACCEPTED) {
    await Application.findByIdAndUpdate(applicationId, { status: ApplicationStatus.ACCEPTED });
    // Notify user via email
    emailEvent.emit("application-accepted",
      { email, userName: firstName, companyName: company.name, jobTitle: application.job.title, companyEmail: company.email });
    return res.status(200).json({ message: "✅ Application accepted successfully" });
  } else if (status === ApplicationStatus.REJECTED) {
    await Application.findByIdAndUpdate(applicationId, { status: ApplicationStatus.REJECTED });
    // Notify user via email
    emailEvent.emit("application-rejected",
      { email, userName: firstName, companyName: company.name, jobTitle: application.job.title });
    return res.status(200).json({ message: "✅ Application rejected successfully" });
  } else {
    return res.status(400).json({ message: `❗Invalid status, Only accept ${ApplicationStatus.ACCEPTED} or ${ApplicationStatus.REJECTED}` });
  }
};