import { User } from "../../DB/index.js";

export const listAllUsers = async () => await User.find().select("-password -OTP -__v");

export const banUser = async ({ userId }) => {
  const user = await User.findByIdAndUpdate(userId, { bannedAt: new Date() });
  if (!user) throw new Error("User not found");
  return "⛔ User has been banned";
};

export const unbanUser = async ({ userId }) => {
  const user = await User.findByIdAndUpdate(userId, { $unset: { bannedAt: 1 } });
  if (!user) throw new Error("User not found");
  return "🔓 User has been unbanned";
};