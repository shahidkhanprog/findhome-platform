// auth.controller.js
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
// import jwt from "jsonwebtoken";

// Secret key for JWT, store in .env in real projects
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

//--------------------------------------[REGISTER USER]--------------------------------------------------------
/**
 * Register a new user
 * Flow:
 * 1. Check if username/email already exists
 * 2. Hash the password securely
 * 3. Create the user with role 'USER' (never trust frontend)
 * 4. Respond with success message and user info (excluding password)
 */
export const register = async (req, res) => {
  const { username, email, password } = req.body; // role is not taken from frontend

  try {
    // 1️⃣ Check duplicates
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

    // 2️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create user in database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "USER", 
      },
    });

    // 4️⃣ Respond without password
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
 * Login user
 * Flow:
 * 1. Find user by email
 * 2. Compare password
 * 3. Generate JWT token containing user id & role
 * 4. Respond with token and user info
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // 3️⃣ Generate JWT token
const Age = 1000 * 60 * 24 * 7; // 7 days

    // const token = jwt.sign(
    //   { id: user.id, role: user.role },
    //   JWT_SECRET,
    //   { expiresIn: "1d" } // token valid for 1 day
    // );

    res.cookie("test2", "my-value", {httpOnly: true, maxAge: Age }).status(200).json({ message: "Login successful"});

    // 4️⃣ Respond with token and user info (excluding password)
    // res.status(200).json({
    //   message: "Login successful",
    //   token,
    // });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

//--------------------------------------[LOGOUT USER]--------------------------------------------------------
/**
 * Logout user
 * Concept:
 * 1. Since we are using JWT, logout on backend is "stateless"
 * 2. Frontend removes token from storage (localStorage / cookies)
 * 3. Optionally, you can implement token blacklist for extra security
 */
export const logout = async (req, res) => {
  try {
    // 1️⃣ Frontend should delete the token
    // 2️⃣ Backend cannot really "invalidate" JWT unless using blacklist
    res.status(200).json({ message: "Logout successful. Please delete the token from client." });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};

//--------------------------------------[PROTECT ROUTES MIDDLEWARE]------------------------------------------
/**
 * Middleware to protect routes and check role
 * Usage: app.get("/admin", authMiddleware("ADMIN"), ...)
 */
export const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer token
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Attach user info to request

      // Check role if required
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};




//==========================================================
// import bcrypt from "bcrypt";
// import prisma from "../lib/prisma.js";

// //--------------------------------------[register]--------------------------------------------------------

// export const register = async (req, res) => {
//   const { username, email, password, role } = req.body;

//   try {

//     const hashedPassword = await bcrypt.hashSync(password, 10);

//     //------- Check if username or email already exists -------
//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [{ username: req.body.username }, { email: req.body.email }],
//       },
//     });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "Username or email already exists" });
//     }

//     //------------------- Create new user --------------------
//     const newUser = await prisma.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword,
//         role: "USER",
//       },
//     });

//     // console.log("User registered:", newUser);

//     //------- Respond with success message -------
//     res.status(201).json({
//       message: "User registered successfully",
//       user: newUser.username,
//     });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res
//       .status(500)
//       .json({ message: "Error registering user", error: error.message });
//   }
// };

// //--------------------------------------[Login]--------------------------------------------------------
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     //--------------------- Find user by email --------------------
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     //-------------------- Compare passwords --------------------
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" }); // 401 Unauthorized
//     }

//     // console.log("Login successful:", user.username);

//     res.status(200).json({ message: "Login successful"});
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Error logging in", error: error.message });
//   }
// };

// //--------------------------------------[logout]--------------------------------------------------------

// export const logout = (req, res) => {
//   console.log("Logout endpoint");
// };
//==================================================