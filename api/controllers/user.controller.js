import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOtp = () => ({
  code: crypto.randomInt(100000, 999999).toString(),
  expiresAt: new Date(Date.now() + 15 * 60 * 1000),
});
// ==============================================================================================================================================
//                                                             buildOtpEmail
// ==============================================================================================================================================
const buildOtpEmail = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
                 FindHome
              </h1>
              <p style="margin:8px 0 0;color:#ddd6fe;font-size:13px;">Password Reset Request</p>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.6;">
                We received a request to reset your FindHome account password.
                Use the OTP below — it expires in <strong>15 minutes</strong>.
              </p>
              <div style="margin:28px 0;text-align:center;">
                <div style="display:inline-block;background:#f5f3ff;border:2px dashed #7c3aed;
                            border-radius:12px;padding:20px 40px;">
                  <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#6d28d9;">
                    ${otp}
                  </span>
                </div>
              </div>
              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                If you did not request a password reset, please ignore this email.
                Your account remains secure.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:11px;">
                © ${new Date().getFullYear()} FindHome · This is an automated email, please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
// ===========================================================================================================================================================================
//                                                                    get All Users
// ===========================================================================================================================================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { _count: { select: { posts: true } } },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//==========================================================================================================================================================================
//                                                                    get User
//==========================================================================================================================================================================
export const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password: _pw, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (error) {
    console.error("getUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//==========================================================================================================================================================================
//                                                                  update User
//==========================================================================================================================================================================
export const updateUser = async (req, res) => {
  const userId      = req.params.id;
  const tokenUserId = req.userId;

  if (tokenUserId !== userId && !req.isAdmin) {
    return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
  }

  const { password, avatar, isActive, role, ...otherUpdates } = req.body;

  try {
    // Check if the new username is already taken by another user
    if (otherUpdates.username) {
      const existing = await prisma.user.findUnique({
        where: { username: otherUpdates.username },
      });
      if (existing && existing.id !== userId) {
        return res.status(409).json({ message: "Username is already taken" });
      }
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...otherUpdates,
        ...(hashedPassword !== null && { password: hashedPassword }),
        ...(avatar                  && { avatar }),
        ...(isActive !== undefined  && { isActive }),
        ...(role && req.isAdmin     && { role }),
      },
    });

    const { password: _pw, ...safeUser } = updatedUser;
    res.status(200).json(safeUser);
  } catch (error) {
    // Fallback: catch Prisma unique constraint error
    if (error.code === "P2002" && error.meta?.target?.includes("username")) {
      return res.status(409).json({ message: "Username is already taken" });
    }
    console.error("updateUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//==================================================================================================================================================================================================================================
//                                                                    delete User
//==================================================================================================================================================================================================================================
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const tokenUserId = req.userId;
  const isAdmin = req.isAdmin;
  const isSelf = tokenUserId === userId;

  if (!isSelf && !isAdmin) {
    return res
      .status(403)
      .json({
        message: "Forbidden: You are not authorized to delete this account",
      });
  }

  try {
    // 1. Find all posts belonging to this user
    const userPosts = await prisma.post.findMany({
      where: { userId },
      select: { id: true },
    });
    const postIds = userPosts.map((p) => p.id);

    // 2. Delete postDetails for those posts
    if (postIds.length > 0) {
      await prisma.postDetail.deleteMany({
        where: { postId: { in: postIds } },
      });
    }

    // 3. Delete savedPosts referencing this user's posts OR saved by this user
    await prisma.savePost.deleteMany({
      where: { OR: [{ userId }, { postId: { in: postIds } }] },
    });

    // 4. Delete the user's posts
    await prisma.post.deleteMany({ where: { userId } });

    // 5. Find chats where this user is a participant
    const userChats = await prisma.chat.findMany({
      where: { userIDs: { has: userId } },
      select: { id: true, userIDs: true },
    });
    const chatIds = userChats.map((c) => c.id);

    // 6. Delete messages in those chats
    if (chatIds.length > 0) {
      await prisma.message.deleteMany({ where: { chatId: { in: chatIds } } });
    }

    // 7. For chats with more than 2 participants just remove the user from the array;
    //    for 1-on-1 chats (2 participants) delete the chat entirely
    for (const chat of userChats) {
      if (chat.userIDs.length <= 2) {
        await prisma.chat.delete({ where: { id: chat.id } });
      } else {
        await prisma.chat.update({
          where: { id: chat.id },
          data: {
            userIDs: { set: chat.userIDs.filter((id) => id !== userId) },
            seenBy: { set: [] },
          },
        });
      }
    }

    // 8. Delete the user's own messages in any other chat
    await prisma.message.deleteMany({ where: { userId } });

    // 9. Finally delete the user
    await prisma.user.delete({ where: { id: userId } });


    // Only clear cookie if user deleted their OWN account
    if (isSelf) {
      res
        .clearCookie("token")
        .status(200)
        .json({ message: "Account deleted successfully" });
    } else {
      res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//==================================================================================================================================================================================================================================
//                                                                      forgot Password
//==================================================================================================================================================================================================================================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(200)
        .json({
          message: "If that email is registered, an OTP has been sent.",
        });
    }

    const { code, expiresAt } = generateOtp();
    const hashedOtp = await bcrypt.hash(code, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpHash: hashedOtp,
        otpExpiresAt: expiresAt,
      },
    });

    await resend.emails.send({
      from: `FindHome <${process.env.RESEND_FROM_EMAIL}>`,
      to: user.email,
      subject: "Your FindHome password reset OTP",
      html: buildOtpEmail(code),
    });

    res
      .status(200)
      .json({ message: "If that email is registered, an OTP has been sent." });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//==================================================================================================================================================================================================================================
//                                                                verify Otp
//==================================================================================================================================================================================================================================
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (new Date() > user.otpExpiresAt) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    const valid = await bcrypt.compare(otp, user.otpHash);
    if (!valid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpHash: null,
        otpExpiresAt: null,
        resetToken: resetToken,
        resetTokenExpiry: resetExpiry,
      },
    });

    res
      .status(200)
      .json({
        resetToken,
        message: "OTP verified. Use the reset token to set a new password.",
      });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//==================================================================================================================================================================================================================================
//                                                                    reset Password
//==================================================================================================================================================================================================================================
export const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  if (!email || !resetToken || !newPassword) {
    return res
      .status(400)
      .json({ message: "email, resetToken, and newPassword are all required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (new Date() > user.resetTokenExpiry) {
      return res
        .status(400)
        .json({ message: "Reset token has expired. Please start over." });
    }

    if (user.resetToken !== resetToken) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res
      .status(200)
      .json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("resetPassword error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//================================================================================================================================================================================================================================
//                                                                    end
//================================================================================================================================================================================================================================