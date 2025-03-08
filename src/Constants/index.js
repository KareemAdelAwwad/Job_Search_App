export const WhiteListedDomains = [
  "https://chat-frontend-route43.vercel.app",
  "http://127.0.0.1:5520", // Chat App
  "http://localhost:5520", // Chat App
  "https://job-chat.kareemadel.com",
  "https://job-login.kareemadel.com",
  "https://login-frontend-route43.vercel.app",
  "http://localhost:4200", // Login App
  undefined
];

export const AuthProvider = {
  GOOGLE: "google",
  SYSTEM: "system"
};

export const Roles = {
  ADMIN: "admin",
  USER: "user"
};

export const OTPType = {
  EMAIL: "email",
  PASSWORD: "password"
};

export const JobType = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time"
};

export const SeniorityLevel = {
  JUNIOR: "Junior",
  MID: "Mid-Level",
  SENIOR: "Senior",
  LEAD: "Team-Lead",
  CTO: "CTO"
};

export const NumberOfEmployees = {
  10: "1-10",
  20: "11-20",
  50: "21-50",
  100: "51-100",
  200: "101-200",
  500: "201-500",
  MORE: "500+"
};

export const JobStatus = {
  ACTIVE: "Active",
  CLOSED: "Closed"
};

export const ApplicationStatus = {
  ACCEPTED: "Accepted",
  PENDING: "Pending",
  VIWED: "Viewed",
  IN_CONSIDER: "In Consideration",
  REJECTED: "Rejected"
};

export const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
export const allowedLegalAttachment = ["application/pdf", "image/png", "image/jpg", "image/jpeg"];