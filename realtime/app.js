import { createServer } from "http";
import { initSocket } from "./socket.js";

const PORT = 4000;

const server = createServer();
initSocket(server);

server.listen(PORT, () => {
  console.log(`🔥 Socket server running on http://localhost:${PORT}`);
});