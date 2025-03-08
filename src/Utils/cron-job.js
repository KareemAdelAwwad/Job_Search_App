import { TokenBlacklist, User } from "../DB/index.js";

export const DeletingExpiredOTP = () =>
  setInterval(async () => {
    console.log("🚀 Cron Job Started!");
    try {
      const users = await User.updateMany(
        { "OTP.expireAt": { $lt: new Date() } },
        { $pull: { OTP: { expireAt: { $lt: new Date() } } } }
      );
      console.log(`🚀 Cron Job Completed! Modified ${users.modifiedCount} users`);
    } catch (error) {
      console.log("🚫 Error in Cron Job", error);
    }
  }, 1000 * 60 * 60 * 6); // 6 hours

export const DeleteExpiredTokens = () => {
  setInterval(async () => {
    try {
      const deletedTokens = await TokenBlacklist.deleteMany({ expireAt: { $lt: new Date() } });
      console.log(`🚀 Cron Job Completed! Deleted ${deletedTokens.deletedCount} tokens`);
    } catch (error) {
      console.log("🚫 Error in Cron Job", error);
    }
  }, 1000 * 60 * 60 * 24); // 24 hours
};