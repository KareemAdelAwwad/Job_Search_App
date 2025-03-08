import jwt from "jsonwebtoken";
import { TokenBlacklist, User } from "../DB/index.js";

export const authentication = () => async (req, res, next) => {
  try {
    const { accesstoken } = req.headers;
    const { userId, tokenId, exp } = jwt.verify(accesstoken, process.env.JWT_SECRET);
    // check if the token is blacklisted
    const isTokenBlacklisted = await TokenBlacklist.findOne({ tokenId: tokenId });
    if (isTokenBlacklisted) {
      return res.status(401).json({ message: "🔑 Unauthorized" });
    }
    // add the user id to the request object
    const user = await User.findById(userId).select("-password -__v -createdAt -updatedAt -OTP");
    if (!user) {
      return res.status(401).json({ message: "❗ User Not Found!" });
    }
    if (user.blockedAt) {
      return res.status(401).json({ message: "❗ User is Blocked!" });
    }
    if (user.deletedAt) {
      return res.status(401).json({ message: "❗ User is Deleted!" });
    }
    req.user = { ...user._doc, token: { tokenId, exp } };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "🔒 Unauthorized" });
  };
};

export const validateToken = async (accesstoken) => {
  try {
    const { userId, tokenId } = jwt.verify(accesstoken, process.env.JWT_SECRET);
    // check if the token is blacklisted
    const isTokenBlacklisted = await TokenBlacklist.findOne({ tokenId: tokenId });
    if (isTokenBlacklisted) {
      return { authUser: null };
    }
    // add the user id to the request object
    const user = await User.findById(userId).select("-password -__v -createdAt -updatedAt -OTP");
    if (!user) {
      return { authUser: null };
    }
    if (user.blockedAt) {
      return { authUser: null };
    }
    if (user.deletedAt) {
      return { authUser: null };
    }
    return { authUser: user };
  } catch (error) {
    console.log(error);
    return { authUser: null };
  };
};