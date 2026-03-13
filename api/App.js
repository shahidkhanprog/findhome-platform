import "dotenv/config";
import express from 'express';
import authRoute from './routes/auth.route.js';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
dotenv.config();
app.use(cookieParser());

app.use('/api/auth', authRoute);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});