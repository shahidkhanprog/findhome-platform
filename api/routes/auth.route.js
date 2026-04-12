import express from 'express';
import { register, login, logout, forgotPassword, verifyOtp, resetPassword, } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// ── Forgot Password Flow
router.post("/forgot-password", forgotPassword); // Step 1: Send OTP
router.post("/verify-otp", verifyOtp);           // Step 2: Verify OTP
router.post("/reset-password", resetPassword);   // Step 3: Reset Password
 

export default router;