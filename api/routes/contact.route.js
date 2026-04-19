// routes/contact.route.js
import express from "express";
import {
  submitContact,
  getAllContacts,
  getUnreadCount,
  markAsRead,
  deleteContact,
} from "../controllers/contact.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// ✅ PUBLIC — anyone can submit the contact form (no login required)
router.post("/", submitContact);

// ✅ ADMIN ONLY — all read/manage routes require token + admin role
router.get(   "/",            verifyToken, verifyAdmin, getAllContacts);
router.get(   "/unread-count",verifyToken, verifyAdmin, getUnreadCount);
router.put(   "/:id/read",    verifyToken, verifyAdmin, markAsRead);
router.delete("/:id",         verifyToken, verifyAdmin, deleteContact);

export default router;