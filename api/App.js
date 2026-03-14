import "dotenv/config";
import express from 'express';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import testRoute from "./routes/test.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: process.env.CLIENT_URL, // Adjust this to your frontend URL
  credentials: true, // Allow cookies to be sent
}));
// Middleware to parse JSON bodies
app.use(express.json());
dotenv.config();
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/test', testRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});