import { Application, Chat, Company, User } from "../../../DB/index.js";
import { socketConnictions } from "../../../Utils/index.js";

export const getChatHistory = async (req, res) => {
  const { _id: senderId } = req.user;
  const { userId: receiverId } = req.params;
  const chat = await Chat.find({
    $or: [
      { senderId, receiverId },
      { senderId: receiverId, receiverId: senderId }
    ]
  }).sort({ createdAt: 1 }).populate([
    { path: "senderId", select: "firstName lastName profilePic" },
    { path: "receiverId", select: "firstName lastName profilePic" },
  ]);
  res.status(200).json(...chat);
};

export const getConnectionsList = async (req, res) => {
  const { _id: userId } = req.user;
  // need to find if the user is hr or candidate
  let user = await Application.findOne({ userId }).populate("jobId");
  // console.log("user", user);
  let connections;
  let isHR;
  if (!user) {
    // Check if the user is HR
    isHR = await Company.find({ HRs: { $in: [userId] } }).populate("jobs");
    // console.log("isHR", isHR);
    if (!isHR) {
      return res.status(400).json({ message: "User is not authorized to view this page" });
    }
    // User is HR
    // Get all applicents for all jobs of all companies of the HR
    // console.log("companies", isHR);
    const jobs = isHR.map((company) => company.jobs).flat();
    // console.log("jobs", jobs);
    const jobIds = jobs.map((job) => job._id);
    // console.log("jobIds", jobIds);
    const applications = await Application.find({ jobId: { $in: jobIds } }).populate("userId", "firstName lastName");
    // console.log("applications", applications);
    connections = applications.map((application) => application.userId);
    // console.log("candidates", connections);
  } else {
    // User is a candidate
    // Find all the chats where the user is the receiver
    const senderIds = await Chat.find({ receiverId: userId }).distinct("senderId");
    connections = await User.find({ _id: { $in: senderIds } }, "firstName lastName email profilePic");
  }

  user = await User.findById(userId, "firstName lastName email profilePic");
  res.status(200).json({ connections, isHR: !!isHR, user });
};

export const sendMessage = async (socket, userId) => {
  try {
    socket.on("sendMessage", async (data) => {
      const { receiverId, body } = data;
      const senderId = userId.toString();
      let chat = await Chat.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      });
      if (!chat) {
        chat = await Chat.create({
          senderId, receiverId,
          messages: [{ senderId, body }]
        });
      }
      chat.messages.push({ senderId, body });
      await chat.save();
      const receiverSocketId = socketConnictions.get(receiverId);
      socket.to(receiverSocketId).emit("receiveMessage", { chat, body });
      socket.emit("successMessage", { chat, body });
    });
  } catch (error) {
    console.log("🚫 Error in sendMessage", error);
  }
};