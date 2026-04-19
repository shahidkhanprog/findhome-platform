import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/user.controller.js";
import {
  verifyAdmin,
  verifyToken,
  verifyTokenOrAdmin,
} from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", verifyTokenOrAdmin, getUser);
router.put("/:id", verifyTokenOrAdmin, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
