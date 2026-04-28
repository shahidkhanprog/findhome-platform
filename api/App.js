import "dotenv/config";
import express from 'express';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import testRoute from "./routes/test.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import savedPostsRoute from "./routes/savedPosts.route.js";
import contactRoute from "./routes/contact.route.js";  
import chatRoute from "./routes/chat.route.js";  
import messageRoute from "./routes/message.route.js";  

const app = express();
const PORT = 3000;

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true, // Allow cookies to be sent
}));

// Middleware to parse JSON bodies
app.use(express.json());
dotenv.config();
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/test', testRoute);
app.use('/api/posts', postRoute);
app.use('/api/saved-posts', savedPostsRoute);
app.use("/api/contact", contactRoute); 
app.use("/api/chats", chatRoute); 
app.use("/api/messages", messageRoute); 


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});