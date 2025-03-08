import { compareSync, hashSync } from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { AuthProvider } from "../../../Constants/index.js";
import { TokenBlacklist, User } from "../../../DB/index.js";
import { emailEvent, GenerateToken } from "../../../Utils/index.js";

export const SignUp = async (req, res) => {
  const { firstName, lastName, email, mobileNumber, password, gender, dateOfBirth } = req.body;
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return res.status(400).json({ message: "❗ Email Already Exist!" });
  }

  // Email Confirmation OTP
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const hasedOTP = hashSync(OTP.toString(), +process.env.SALT_ROUNDS);
  emailEvent.emit("confirmation", { email, userName: firstName, OTP });

  const user = new User({
    firstName,
    lastName,
    email,
    mobileNumber,
    password,
    gender,
    dateOfBirth,
    OTP: [{ code: hasedOTP, type: "email", expireAt: new Date(Date.now() + 10 * 60 * 1000) }]  // 10 minutes
  });
  await user.save();
  return res.status(201).json({ message: "🎉 User Created!" });
};

export const VerifyEmail = async (req, res) => {
  let { email, OTP } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "❗ Invalid Email!" });
  }
  if (user.isConfirmed) {
    return res.status(400).json({ message: "❗ Email Already Verified" });
  };
  const userOTP = user.OTP.find((otp) => otp.type === "email");
  const isOTPCorrect = compareSync(OTP, userOTP.code);
  if (!isOTPCorrect) {
    return res.status(400).json({ message: "❗ Invalid OTP!" });
  }
  if (new Date() > userOTP.expireAt) {
    OTP = Math.floor(100000 + Math.random() * 900000);
    const hasedOTP = hashSync(OTP.toString(), +process.env.SALT_ROUNDS);
    emailEvent.emit("confirmation", { email, userName: user.firstName, OTP });
    await User.findOneAndUpdate({ email }, { $set: { OTP: [{ code: hasedOTP, type: "email", expireAt: new Date(Date.now() + 10 * 60 * 1000) }] } });
    return res.status(400).json({ message: "❗ OTP Expired, We sent you a new one! 😉" });
  }

  await User.updateOne({ email }, { $pull: { OTP: { type: "email" } }, isConfirmed: true });
  return res.status(200).json({ message: "🎉 Email Verified!" });
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, provider: AuthProvider.SYSTEM });
  if (!user) {
    return res.status(400).json({ message: "❗ Invalid Email!" });
  }
  const isPasswordCorrect = compareSync(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "❗ Invalid Password!" });
  }
  if (!user.isConfirmed) {
    return res.status(400).json({ message: "❗ Email Not Verified!" });
  }
  if (user.bannedAt) {
    return res.status(400).json({ message: "❗ You are banned!" });
  }
  if (user.deletedAt) {
    return res.status(400).json({ message: "❗ Your account is deleted!" });
  }
  // Generate JWT Token
  const tokenPayload = { userId: user._id, email: user.email, role: user.role, tokenId: v4() };
  const { accessToken, refreshToken } = GenerateToken(tokenPayload);
  return res.status(200).json({
    message: "🎉 Login Success!",
    accessToken, refreshToken,
  });
};

export const GoogleAuth = async (req, res) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const { email, email_verified, given_name, family_name, picture } = payload;

  if (!email_verified) {
    return res.status(400).json({ message: "❗ Google Email Not Verified!" });
  }

  let user = await User.findOne({ email, provider: AuthProvider.GOOGLE });
  if (user && user.bannedAt) {
    return res.status(400).json({ message: "❗ You are banned!" });
  }
  if (user && user.deletedAt) {
    return res.status(400).json({ message: "❗ Your account is deleted!" });
  }

  // If user found, generate JWT Token (Sign In)
  if (user) {
    const tokenPayload = { userId: user._id, email: user.email, role: user.role, tokenId: v4() };
    const { accessToken, refreshToken } = GenerateToken(tokenPayload);
    return res.status(200).json({
      message: "🎉 Google Auth Success!",
      accessToken, refreshToken
    });
  } else {
    // If user not found, create a new user (Sign Up)
    const dumpHashedPassword = hashSync(Math.random().toString(36).slice(-8), +process.env.SALT_ROUNDS);
    user = new User({
      firstName: given_name,
      lastName: family_name,
      email,
      password: dumpHashedPassword,
      profilePic: { secure_url: picture },
      provider: AuthProvider.GOOGLE,
      isConfirmed: true
    });
    await user.save();

    return res.status(200).json({ message: "🎉 Google Auth Success!" });
  }
};

export const ForgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, provider: AuthProvider.SYSTEM });
  if (!user) {
    return res.status(400).json({ message: "❗ Invalid Email!" });
  }
  if (!user.isConfirmed) {
    return res.status(400).json({ message: "❗ Email Not Verified!" });
  }
  if (user.bannedAt) {
    return res.status(400).json({ message: "❗ You are banned!" });
  }
  if (user.deletedAt) {
    return res.status(400).json({ message: "❗ Your account is deleted!" });
  }

  // Email Confirmation OTP
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const hasedOTP = hashSync(OTP.toString(), +process.env.SALT_ROUNDS);
  emailEvent.emit("forgot-password", { email, userName: user.firstName, OTP });
  await User.findOneAndUpdate({ email }, { $set: { OTP: [{ code: hasedOTP, type: "password", expireAt: new Date(Date.now() + 10 * 60 * 1000) }] } });
  return res.status(200).json({ message: "🗝️ OTP Sent to your Email!" });
};

export const ResetPassword = async (req, res) => {
  let { email, OTP, password: newPassword } = req.body;
  const user = await User.findOne({ email, provider: AuthProvider.SYSTEM });
  if (!user) {
    return res.status(400).json({ message: "❗ Invalid Email!" });
  }

  // Check OTP
  const userOTP = user.OTP.find((otp) => otp.type === "password");
  const isOTPCorrect = compareSync(OTP, userOTP.code);
  if (!isOTPCorrect) {
    return res.status(400).json({ message: "❗ Invalid OTP!" });
  }

  // Check OTP Expiry
  if (new Date() > userOTP.expireAt) {
    OTP = Math.floor(100000 + Math.random() * 900000);
    const hasedOTP = hashSync(OTP.toString(), +process.env.SALT_ROUNDS);
    emailEvent.emit("forgot-password", { email, userName: user.firstName, OTP });
    await User.findOneAndUpdate({ email },
      { $set: { OTP: [{ code: hasedOTP, type: "password", expireAt: new Date(Date.now() + 10 * 60 * 1000) }] } });
    return res.status(400).json({ message: "❗ OTP Expired, We sent you a new one! 😉" });
  }

  // Update Password
  const hashedPassword = hashSync(newPassword, +process.env.SALT_ROUNDS);
  await User.findOneAndUpdate({ email, provider: AuthProvider.SYSTEM }, { $set: { password: hashedPassword }, changeCredentialTime: new Date() });
  emailEvent.emit("password-changed", { email, userName: user.firstName, timestamp: new Date().toLocaleString() });
  return res.status(200).json({ message: "🎉 Password Updated!" });
};

export const RefreshToken = async (req, res) => {
  const { refreshtoken } = req.headers;
  const { userId, role, email, exp, iat } = jwt.verify(refreshtoken, process.env.JWT_SECRET);
  // Check if token is expired
  if (exp < Date.now().valueOf() / 1000) {
    return res.status(401).json({ message: "❗ Token Expired!" });
  }
  // Check CredentialTime date
  const user = await User.findById(userId);
  if (user.changeCredentialTime > new Date(iat * 1000)) {
    return res.status(401).json({ message: "❗ Token Expired!" });
  }
  

  const tokenPayload = { userId, email, role, tokenId: v4() };
  const { accessToken } = GenerateToken(tokenPayload);
  await User.updateOne({ _id: userId }, { $set: { changeCredentialTime: new Date() } });
  return res.status(200).json({ accessToken });
};

export const Logout = async (req, res) => {
  let { accesstoken, refreshtoken } = req.headers;
  accesstoken = jwt.verify(accesstoken, process.env.JWT_SECRET);
  refreshtoken = jwt.verify(refreshtoken, process.env.JWT_SECRET);

  // Add the token to the blacklist
  await TokenBlacklist.insertMany([
    { tokenId: accesstoken.tokenId, exp: accesstoken.exp },
    { tokenId: refreshtoken.tokenId, exp: refreshtoken.exp }
  ]);

  return res.status(200).json({ message: "🚪 Logout Success!" });
};