import { Company } from "../../DB/index.js";

export const listAllCompanies = async () => await Company.find().select("-__v");

export const banCompany = async ({ companyId }) => {
  const company = await Company.findByIdAndUpdate(companyId, { bannedAt: new Date() });
  if (!company) throw new Error("Company not found");
  return "⛔ Company has been banned";
};

export const unbanCompany = async ({ companyId }) => {
  const company = await Company.findByIdAndUpdate(companyId, { $unset: { bannedAt: 1 } });
  if (!company) throw new Error("Company not found");
  return "🔓 Company has been unbanned";
};

export const approveCompany = async ({ companyId }) => {
  const company = await Company.findByIdAndUpdate(companyId, { approvedByAdmin: true });
  if (!company) throw new Error("Company not found");
  return "✅ Company has been approved";
};