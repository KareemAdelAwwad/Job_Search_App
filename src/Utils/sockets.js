import { validateToken } from "../Middleware/authentication.js";
import { sendMessage } from "../Modules/Chat/Services/chat.service.js";

export const socketConnictions = new Map();

export const registerSocketId = async (handshake, id) => {
  try {
    const user = await validateToken(handshake.auth.accesstoken);
    socketConnictions.set(user?.authUser?._id?.toString(), id);
    console.log("🔌 Socket Connections ", socketConnictions);
    return { userId: user?.authUser?._id?.toString() };
  } catch (error) {
    console.log("🚫 Error in registerSocketId", error);
    return { userId: null };
  }
};

export const establishIoConnection = (io) => io.on("connection", async (socket) => {
  console.log("🚀 New client connected");

  const { userId } = await registerSocketId(socket.handshake, socket.id);

  await sendMessage(socket, userId);

  socket.on("disconnect", () => {
    console.log("🚀 Client disconnected");
  });
});