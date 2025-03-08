import ExcelJS from "exceljs";
import cloudinary from "../../../config/cloudinary.js";
import { Roles } from "../../../Constants/index.js";
import { Application, Company, Job, User } from "../../../DB/index.js";

export const AddCompany = async (req, res) => {
  const { name, description, industry, address, numberOfEmployees, email, HRs } = req.body;
  let logo, cover, legalAttachment;
  const { _id: createdBy } = req.user;
  const isNameExist = await Company.findOne({ name });
  const isEmailExist = await Company.findOne({ email });
  if (isNameExist) return res.status(400).json({ message: "🏢 Company name already exist" });
  if (isEmailExist) return res.status(400).json({ message: "🏢 Company email already exist" });

  // Validate HRs
  let uniqueHRs = [];
  if (typeof (HRs) === "string") {
    uniqueHRs = [HRs];
  } else {
    uniqueHRs = [...new Set(HRs)];
  }
  if (uniqueHRs && uniqueHRs.length > 0) {
    let isHRExist;
    uniqueHRs.forEach(async (HR) => {
      isHRExist = await User.findById({ _id: HR });
    });
    if (!isHRExist) return res.status(400).json({ message: "👨‍💼 HR not found." });
  };

  // Upload files to cloudinary
  await cloudinary().uploader.upload(req.files.logo[0].path, { folder: `${process.env.FOLDER_NAME}/Company/Logo` }, async (error, result) => {
    if (error) return res.status(400).json({ message: "🏢 Company logo upload failed" });
    logo = { secure_url: result.secure_url, public_id: result.public_id };
  });

  await cloudinary().uploader.upload(req.files.cover[0].path, { folder: `${process.env.FOLDER_NAME}/Company/Cover` }, async (error, result) => {
    if (error) return res.status(400).json({ message: "🏢 Company cover upload failed" });
    cover = { secure_url: result.secure_url, public_id: result.public_id };
  });

  await cloudinary().uploader.upload(req.files.legalAttachment[0].path, { folder: `${process.env.FOLDER_NAME}/Company/LegalAttachment` }, async (error, result) => {
    if (error) return res.status(400).json({ message: "🏢 Company legalAttachment upload failed" });
    legalAttachment = { secure_url: result.secure_url, public_id: result.public_id };
  });

  // Save company to database
  const newCompany = new Company({
    name, description, industry, address, numberOfEmployees, email, createdBy, HRs: uniqueHRs, logo, cover, legalAttachment
  });
  await newCompany.save();
  res.status(201).json({ message: "🏢 Company created successfully" });
};

export const UpdateCompany = async (req, res) => {
  const { _id: createdBy } = req.user;
  const { companyId } = req.params;
  const { name, description, industry, address, numberOfEmployees, email, HRs } = req.body;
  const { logo, cover } = req.files;

  const company = await Company.findById({ _id: companyId });
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  (company.createdBy.toString() !== createdBy.toString()) && res.status(401).json({ message: "🚫 Unauthorized to update this company!" });

  if (name) {
    const isNameExist = await Company.findOne({ name });
    if (isNameExist) return res.status(400).json({ message: "🏢 Company name already exist" });
  };
  if (email) {
    const isEmailExist = await Company.findOne({ email });
    if (isEmailExist) return res.status(400).json({ message: "🏢 Company email already exist" });
  }
  // Validate HRs
  let uniqueHRs = [];
  if (typeof (HRs) === "string") {
    uniqueHRs = [HRs];
  } else {
    uniqueHRs = [...new Set(HRs)];
  }
  console.log(typeof (uniqueHRs), uniqueHRs);

  if (uniqueHRs && uniqueHRs.length > 0) {
    uniqueHRs.forEach(async (HR) => {
      const isHRExist = await User.findById({ _id: HR });
      if (!isHRExist) return res.status(400).json({ message: `👨‍💼 HR not found: ${HR}` });
    }
    );

    company.HRs = [...new Set(company.HRs.concat(uniqueHRs))];
  };

  // Upload files to cloudinary
  if (logo) {
    // Delete existing logo from cloudinary
    company.logo.public_id && await cloudinary().uploader.destroy(company.logo.public_id);
    // Upload new logo to cloudinary
    await cloudinary().uploader.upload(logo[0].path, { folder: `${process.env.FOLDER_NAME}/Company/Logo` }, async (error, result) => {
      if (error) return res.status(400).json({ message: "🏢 Company logo upload failed" });
      company.logo = { secure_url: result.secure_url, public_id: result.public_id };
    });
  };
  if (cover) {
    // Delete existing cover from cloudinary
    company.cover.public_id && await cloudinary().uploader.destroy(company.cover.public_id);
    // Upload new cover to cloudinary
    await cloudinary().uploader.upload(cover[0].path, { folder: `${process.env.FOLDER_NAME}/Company/Cover` }, async (error, result) => {
      if (error) return res.status(400).json({ message: "🏢 Company cover upload failed" });
      company.cover = { secure_url: result.secure_url, public_id: result.public_id };
    });
  };

  // Update company details
  name && (company.name = name);
  description && (company.description = description);
  industry && (company.industry = industry);
  address && (company.address = address);
  numberOfEmployees && (company.numberOfEmployees = numberOfEmployees);
  email && (company.email = email);
  await company.save();
  res.status(200).json({ message: "🏢 Company updated successfully" });
};

export const DeleteCompany = async (req, res) => {
  const { _id: createdBy } = req.user;
  const { companyId } = req.params;
  const company = await Company.findById({ _id: companyId });
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  if (company.deletedAt) return res.status(400).json({ message: "🏢 Company already deleted" });
  if ((company.createdBy.toString() !== createdBy.toString()) && (req.user.role !== Roles.ADMIN)) {
    res.status(401).json({ message: "🚫 Unauthorized to delete this company!" });
  }

  // Soft Delete company from database
  company.deletedAt = new Date();
  await company.save();
  res.status(200).json({ message: "🏢 Company deleted successfully" });
};

export const GetCompanyJobs = async (req, res) => {
  const { companyId } = req.params;
  const company = await Company.findById({ _id: companyId }).populate("jobs");
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  if (company.deletedAt) return res.status(400).json({ message: "🏢 Company deleted" });
  res.status(200).json({ company });
};

export const GetCompanyByName = async (req, res) => {
  const { companyName } = req.params;
  const company = await Company.findOne({ name: companyName });
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  if (company.deletedAt) return res.status(400).json({ message: "🏢 Company deleted" });
  res.status(200).json({ company });
};

export const UploadLogo = async (req, res) => {
  const { _id: createdBy } = req.user;
  const { companyId } = req.params;
  const logo = req.file;
  const company = await Company.findById({ _id: companyId });
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  if (company.deletedAt) return res.status(400).json({ message: "🏢 Company already deleted" });
  if ((company.createdBy.toString() !== createdBy.toString()) && (req.user.role !== Roles.ADMIN)) {
    res.status(401).json({ message: "🚫 Unauthorized to delete this company!" });
  }

  // Upload files to cloudinary
  await cloudinary().uploader.upload(logo.path, { folder: `${process.env.FOLDER_NAME}/Company/Logo` }, async (error, result) => {
    if (error) return res.status(400).json({ message: "🏢 Company logo upload failed" });
    // Delete existing logo from cloudinary
    company.logo.public_id && await cloudinary().uploader.destroy(company.logo.public_id);
    // Update new logo to database
    company.logo = { secure_url: result.secure_url, public_id: result.public_id };
    await company.save();
    res.status(200).json({ message: "🏢 Company logo updated successfully" });
  });
};

export const UploadCover = async (req, res) => {
  const { _id: createdBy } = req.user;
  const { companyId } = req.params;
  const cover = req.file;
  const company = await Company.findById({ _id: companyId });
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  if (company.deletedAt) return res.status(400).json({ message: "🏢 Company already deleted" });
  if ((company.createdBy.toString() !== createdBy.toString()) && (req.user.role !== Roles.ADMIN)) {
    res.status(401).json({ message: "🚫 Unauthorized to delete this company!" });
  }

  // Upload files to cloudinary
  await cloudinary().uploader.upload(cover.path, { folder: `${process.env.FOLDER_NAME}/Company/Cover` }, async (error, result) => {
    if (error) return res.status(400).json({ message: "🏢 Company cover upload failed" });
    // Delete existing cover from cloudinary
    company.cover.public_id && await cloudinary().uploader.destroy(company.cover.public_id);
    // Update new cover to database
    company.cover = { secure_url: result.secure_url, public_id: result.public_id };
    await company.save();
    res.status(200).json({ message: "🏢 Company cover updated successfully" });
  });
};

export const DeleteLogo = async (req, res) => {
  const { _id: createdBy } = req.user;
  const { companyId } = req.params;
  const company = await Company.findById({ _id: companyId });
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  if (company.deletedAt) return res.status(400).json({ message: "🏢 Company already deleted" });
  if ((company.createdBy.toString() !== createdBy.toString()) && (req.user.role !== Roles.ADMIN)) {
    res.status(401).json({ message: "🚫 Unauthorized to delete this company!" });
  }

  // Delete existing logo from cloudinary
  company.logo.public_id && await cloudinary().uploader.destroy(company.logo.public_id);
  // Update new logo to database
  company.logo = {};
  await company.save();
  res.status(200).json({ message: "🏢 Company logo deleted successfully" });
};

export const DeleteCover = async (req, res) => {
  const { _id: createdBy } = req.user;
  const { companyId } = req.params;
  const company = await Company.findById({ _id: companyId });
  if (!company) return res.status(400).json({ message: "🏢 Company not found" });
  if (company.deletedAt) return res.status(400).json({ message: "🏢 Company already deleted" });
  if ((company.createdBy.toString() !== createdBy.toString()) && (req.user.role !== Roles.ADMIN)) {
    res.status(401).json({ message: "🚫 Unauthorized to delete this company!" });
  }

  // Delete existing cover from cloudinary
  company.cover.public_id && await cloudinary().uploader.destroy(company.cover.public_id);
  // Update new cover to database
  company.cover = {};
  await company.save();
  res.status(200).json({ message: "🏢 Company cover deleted successfully" });
};

export const ExportTOExcel = async (req, res) => {
  const { companyId } = req.params;
  if (!companyId) return res.status(400).json({ message: "🏢 Company ID is Required!" });
  const companyJobs = await Job.find({ companyId });
  if (!companyJobs) return res.status(400).json({ message: "🏢 This company has no jobs." });

  const applications = await Application.find({ jobId: { $in: companyJobs } }).populate([
    { path: "userId", select: "username firstName lastName email" },
    { path: "jobId", select: "title description" }
  ]);
  if (!applications) return res.status(400).json({ message: "🏢 Applications not found" });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Applications");
  worksheet.columns = [
    { header: "User Name", key: "userName", width: 20 },
    { header: "User Email", key: "userEmail", width: 40 },
    { header: "Job Title", key: "jobTitle", width: 20 },
    { header: "Job Description", key: "jobDescription", width: 20 },
    { header: "Application Status", key: "applicationStatus", width: 20 },
    { header: "Application Date", key: "applicationDate", width: 20 }
  ];

  applications.forEach((application) => {
    worksheet.addRow({
      userName: application.userId.username,
      userEmail: application.userId.email,
      jobTitle: application.jobId.title,
      jobDescription: application.jobId.description,
      applicationStatus: application.status,
      applicationDate: application.createdAt
    });
  });

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=Applications.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};