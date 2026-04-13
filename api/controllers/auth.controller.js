import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import resend from "../lib/resend.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// OTP STORE (TEMP MEMORY)
const otpStore = new Map();

// ==================================================================================================================================================
// REGISTER
// ==================================================================================================================================================
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

// ==================================================================================================================================================
// LOGIN
// ==================================================================================================================================================
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
      { expiresIn: "7d" },
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

// ==================================================================================================================================================
// LOGOUT
// ==================================================================================================================================================
export const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

// ==================================================================================================================================================
// FORGOT PASSWORD (SEND OTP - RESEND)
// ==================================================================================================================================================
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

    // Grab the first name for a personal touch
    const firstName = user.username?.split(" ")[0] || "there";

    // SEND EMAIL USING RESEND
    await resend.emails.send({
      from: "FindHome <onboarding@resend.dev>",
      to: email,
      subject: "Your Password Reset Code — Action Required",
      html: `
        <div style="background:#f4f6f9;padding:40px 0;font-family:Arial,sans-serif;">
          <div style="background:#ffffff;max-width:540px;margin:0 auto;border-radius:6px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background:#0f1623;padding:26px 40px;display:flex;align-items:center;">
              <div style="width:9px;height:9px;border-radius:50%;background:#4f8ef7;margin-right:10px;display:inline-block;"></div>
              <span style="color:#ffffff;font-size:14px;letter-spacing:3px;text-transform:uppercase;">FindHome</span>
            </div>

            <!-- Body -->
            <div style="padding:44px 40px 36px;">

              <!-- Greeting -->
              <p style="margin:0 0 4px;font-size:13px;color:#9aa0ab;letter-spacing:1px;text-transform:uppercase;">Password Reset</p>
              <h2 style="margin:0 0 20px;font-size:24px;font-weight:600;color:#0f1623;">
                Hi, ${firstName} 👋
              </h2>

              <p style="margin:0 0 24px;font-size:15px;color:#4a5568;line-height:1.75;">
                Someone (hopefully you!) requested a password reset for your FindHome account linked to
                <strong style="color:#0f1623;">${email}</strong>.
                Use the code below to continue. It's valid for the next <strong>10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background:#f7f8fa;border:1px solid #e2e6ea;border-radius:6px;border-top:4px solid #4f8ef7;padding:28px;margin:0 0 24px;text-align:center;">
                <p style="margin:0 0 10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9aa0ab;">Your verification code</p>
                <div style="font-family:'Courier New',monospace;font-size:44px;font-weight:800;letter-spacing:16px;color:#0f1623;padding:6px 0 10px;">
                  ${otp}
                </div>
                <div style="display:inline-block;background:#fff3f3;border:1px solid #ffd5d5;border-radius:20px;padding:5px 14px;margin-top:4px;">
                  <span style="font-size:12px;color:#e05252;font-weight:600;">⏱ Expires in 10 minutes</span>
                </div>
              </div>

              <!-- Didn't request notice -->
              <div style="background:#f0f7ff;border-left:4px solid #4f8ef7;border-radius:4px;padding:14px 18px;margin:0 0 24px;">
                <p style="margin:0;font-size:13px;color:#2d5fa8;line-height:1.6;">
                  <strong>Didn't request this?</strong> No worries — just ignore this email. Your password will remain unchanged and your account is safe.
                </p>
              </div>

              <!-- Security warning -->
              <div style="background:#fffbf0;border:1px solid #f5e6b2;border-radius:4px;padding:14px 18px;margin:0 0 36px;">
                <p style="margin:0;font-size:13px;color:#7a6020;line-height:1.6;">
                  🔒 <strong>Never share this code</strong> with anyone. FindHome support will <em>never</em> ask for your OTP via phone, email, or chat.
                </p>
              </div>

              <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.7;">
                Stay secure,<br>
                <strong style="color:#0f1623;">The FindHome Team</strong>
              </p>
            </div>

            <!-- Divider -->
            <div style="height:1px;background:#edf0f3;margin:0 40px;"></div>

            <!-- Footer -->
            <div style="padding:22px 40px;background:#f7f8fa;">
              <p style="margin:0 0 6px;font-size:11px;color:#b0b8c4;text-align:center;line-height:1.7;">
                This email was sent to <strong>${email}</strong> because a password reset was requested.<br>
                If this wasn't you, please <a href="mailto:shahidkhan.prog@gmail.com" style="color:#4f8ef7;text-decoration:none;">contact our support team</a> immediately.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#c8cdd4;text-align:center;">
                &copy; 2025 FindHome. All rights reserved.
              </p>
            </div>

          </div>
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
// ==================================================================================================================================================
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
// ================================================================================================================================================================================================
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
// ==================================================================================================================================================
// ==================================================================================================================================================