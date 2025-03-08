import { compareSync } from "bcrypt";
import { TokenBlacklist, User } from "../../../DB/index.js";
import { Encrypt, emailEvent } from "../../../Utils/index.js";
import cloudinary from "../../../config/cloudinary.js";

export const UpdateUserAccount = async (req, res) => {
  const { mobileNumber, dateOfBirth, firstName, lastName, gender } = req.body;
  console.log(req.user);
  const { _id } = req.user;
  const encryptedMobileNumber = Encrypt(mobileNumber, process.env.ENCRYPTION_KEY);
  await User.findByIdAndUpdate(_id, {
    mobileNumber: encryptedMobileNumber,
    dateOfBirth,
    firstName,
    lastName,
    gender
  });

  res.status(200).json({ message: "User Updated Successfully!" });
};

export const GetUserAccount = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-password -__v -createdAt -updatedAt -OTP");
  res.status(200).json({ user });
};

export const GetUserProfile = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select("firstName lastName username mobileNumber profilePic coverPic");
  if (!user) {
    return res.status(404).json({ message: "👻 User Not Found!" });
  }
  res.status(200).json({ user });
};

export const ChangePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { _id } = req.user;
  const user = await User.findById(_id);
  const isPasswordMatch = compareSync(oldPassword, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "❗ Invalid Old Password!" });
  }
  user.password = newPassword;
  await user.save();
  await TokenBlacklist.create(req.user.token);
  emailEvent.emit("password-changed", { email: user.email, userName: user.username, timestamp: new Date().toLocaleString() });
  res.status(200).json({ message: "🔐 Password Changed Successfully!" });
};

export const UploadProfilePic = async (req, res) => {
  const { _id } = req.user;
  await cloudinary().uploader.upload(req.file.path,
    { folder: `${process.env.FOLDER_NAME}/User/profilePic` },
    async (error, result) => {
      if (error) {
        return res.status(400).json({ message: "❌ Failed to Upload Image!" });
      }

      await User.findByIdAndUpdate(_id, { profilePic: { secure_url: result.secure_url, public_id: result.public_id } });
      res.status(200).json({ message: "🖼️ Profile Picture Uploaded Successfully!" });
    });
};

export const UploadCoverPic = async (req, res) => {
  const { _id } = req.user;
  await cloudinary().uploader.upload(req.file.path,
    { folder: `${process.env.FOLDER_NAME}/User/coverPic` },
    async (error, result) => {
      if (error) {
        return res.status(400).json({ message: "❌ Failed to Upload Image!" });
      }

      await User.findByIdAndUpdate(_id, { coverPic: { secure_url: result.secure_url, public_id: result.public_id } });
      res.status(200).json({ message: "🖼️ Cover Picture Uploaded Successfully!" });
    });
};

export const DeleteProfilePic = async (req, res) => {
  const { _id } = req.user;
  const { profilePic } = await User.findById(_id).select("profilePic.public_id");
  await cloudinary().uploader.destroy(profilePic.public_id, async (error, result) => {
    if (error) {
      return res.status(400).json({ message: "❌ Failed to Delete Image!" });
    }
    await User.findByIdAndUpdate(_id, { $unset: { profilePic: 1 } });
    res.status(200).json({ message: "🗑️ Profile Picture Deleted Successfully!" });
  }
  );
};

export const DeleteCoverPic = async (req, res) => {
  const { _id } = req.user;
  const { coverPic } = await User.findById(_id).select("coverPic.public_id");
  await cloudinary().uploader.destroy(coverPic.public_id, async (error, result) => {
    if (error) {
      return res.status(400).json({ message: "❌ Failed to Delete Image!" });
    }
    await User.findByIdAndUpdate(_id, { $unset: { coverPic: 1 } });
    res.status(200).json({ message: "🗑️ Cover Picture Deleted Successfully!" });
  });
};

export const SoftDeleteAccount = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { deletedAt: new Date() });
  res.status(200).json({ message: "👻 Account Deleted Successfully!" });
};