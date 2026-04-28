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

    socket.on("newUser", ({ userId, username, avatar } = {}) => {
      if (!userId) return;
      userSocketMap[userId] = { socketId: socket.id, username, avatar };
      socket.userId = userId;
      console.log(`User registered: ${username} (${userId})`);
    });

    socket.on("sendMessage", ({ chatId, message, receiverId }) => {
      const receiverEntry = userSocketMap[receiverId];
      if (!receiverEntry) return;

      const senderEntry = userSocketMap[socket.userId];
      const enrichedMessage = {
        ...message,
        senderUsername: senderEntry?.username ?? null,
        senderAvatar:   senderEntry?.avatar   ?? null,
      };

      io.to(receiverEntry.socketId).emit("receiveMessage", {
        chatId,
        message: enrichedMessage,
      });
    });

    socket.on("typing", ({ chatId, receiverId }) => {
      const entry = userSocketMap[receiverId];
      if (entry) {
        io.to(entry.socketId).emit("typing", { chatId, userId: socket.userId });
      }
    });

    socket.on("stopTyping", ({ chatId, receiverId }) => {
      const entry = userSocketMap[receiverId];
      if (entry) {
        io.to(entry.socketId).emit("stopTyping", { chatId });
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        delete userSocketMap[socket.userId];
        console.log(`User disconnected: ${socket.userId}`);
      }
    });
  });

  return io;
};