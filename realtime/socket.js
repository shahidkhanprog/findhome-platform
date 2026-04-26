import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  const userSocketMap = {};

  io.on("connection", (socket) => {
    console.log("client connected:", socket.id);

    socket.on("newUser", (userId) => {
      userSocketMap[userId] = socket.id;
      socket.userId = userId;
    });

    socket.on("sendMessage", ({ chatId, message, receiverId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { chatId, message });
      }
    });

    socket.on("typing", ({ chatId, receiverId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { chatId, userId: socket.userId });
      }
    });

    socket.on("stopTyping", ({ chatId, receiverId }) => {
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { chatId });
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId) delete userSocketMap[socket.userId];
    });
  });

  return io;
};