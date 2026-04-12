import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import resend from "../lib/resend.js"; 

// OTP STORE (TEMP MEMORY)
const otpStore = new Map();


// ======================================================
// REGISTER
// ======================================================
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Register error" });
  }
};


// ======================================================
// LOGIN
// ======================================================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: user.role === "ADMIN",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user;

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ userData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login error" });
  }
};


// ======================================================
// LOGOUT
// ======================================================
export const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};


// ======================================================
// FORGOT PASSWORD (SEND OTP - RESEND)
// ======================================================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      verified: false,
    });

    // ✅ SEND EMAIL USING RESEND
    await resend.emails.send({
      from: "FindHome <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Password Reset OTP</h2>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};


// ======================================================
// VERIFY OTP
// ======================================================
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  record.verified = true;
  otpStore.set(email, record);

  res.json({ message: "OTP verified" });
};


// ======================================================
// RESET PASSWORD
// ======================================================
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const record = otpStore.get(email);

    if (!record || !record.verified) {
      return res.status(403).json({ message: "OTP not verified" });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email);
      return res.status(403).json({ message: "Session expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    otpStore.delete(email);

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Reset failed" });
  }
};