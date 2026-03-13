//==================================================================================================
//              You are editing the auth.controller.js [ auth.controller.js]
//==================================================================================================

import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

//--------------------------------------[REGISTER USER]--------------------------------------------------------
/**
 * Registers a new user after checking for duplicate username/email.
 * Hashes the password and stores the user with default role "USER".
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Reject if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

//--------------------------------------[LOGIN USER]--------------------------------------------------------
/**
 * Authenticates a user by email and password.
 * Issues a signed JWT stored as an HTTP-only cookie on success.
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Token expiry: 7 days in milliseconds
    const Age = 1000 * 60 * 24 * 7;

    const token = jwt.sign(
      { 
        id: user.id
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: Age }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: Age }).status(200).json({ message: "Login successful" });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

//--------------------------------------[LOGOUT USER]--------------------------------------------------------
/** Logs out the user by clearing the JWT cookie. */

export const logout = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({ message: "Logout successful" });
  
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};

//--------------------------------------[PROTECT ROUTES MIDDLEWARE]------------------------------------------

// export const authMiddleware = (requiredRole) => {
//   return (req, res, next) => {
//     try {
//       const token = req.headers.authorization?.split(" ")[1]; // Bearer token
//       if (!token) return res.status(401).json({ message: "Unauthorized" });

//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.user = decoded; // Attach user info to request

//       // Check role if required
//       if (requiredRole && req.user.role !== requiredRole) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       next();
//     } catch (error) {
//       console.error("Auth error:", error);
//       res.status(401).json({ message: "Invalid or expired token" });
//     }
//   };
// };