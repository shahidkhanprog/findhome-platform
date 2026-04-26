import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let OnlineUsers = [];
const addUser = (userId, socketId) => {
  const isUserExist = OnlineUsers.find((user) => user.userId === userId);
  if (!isUserExist) {
    OnlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  OnlineUsers = OnlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return OnlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    socket.on("newUser", (user) => { addUser(user.userId, socket.id); });

    socket.on("sendMessage", ({  receiverId, text }) => {
        const receiver = getUser(receiverId);
        io.to(receiver.socketId).emit("getMessage", text);
    });

    socket.on("disconnect", () => { removeUser(socket.id); });
});

io.listen(4000);

console.log("Socket.IO server running on port 4000");
