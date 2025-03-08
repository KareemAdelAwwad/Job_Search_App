import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messages: [
    {
      body: String,
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    }
  ]
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
export { Chat };

