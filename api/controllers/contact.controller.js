// controllers/contact.controller.js
import prisma from "../lib/prisma.js";

/* ── PUBLIC: Submit contact form (no auth required) ──────────── */
export const submitContact = async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fullName?.trim())
    return res.status(400).json({ field: "fullName", message: "Full name is required" });

  if (!email?.trim())
    return res.status(400).json({ field: "email", message: "Email address is required" });

  if (!emailRegex.test(email.trim()))
    return res.status(400).json({ field: "email", message: "Please enter a valid email address" });

  if (!message?.trim())
    return res.status(400).json({ field: "message", message: "Message cannot be empty" });

  if (message.trim().length < 10)
    return res.status(400).json({ field: "message", message: "Message must be at least 10 characters" });

  try {
    await prisma.contactMessage.create({
      data: {
        fullName: fullName.trim(),
        email:    email.trim().toLowerCase(),
        phone:    phone?.trim() || null,
        subject:  subject?.trim() || "General Inquiry",
        message:  message.trim(),
      },
    });

    res.status(201).json({ message: "Message received! We'll get back to you within 24 hours." });
  } catch (error) {
    console.error("submitContact error:", error);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
};

/* ── ADMIN: Get all contact messages ─────────────────────────── */
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("getAllContacts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ── ADMIN: Get unread count only (for dashboard badge) ──────── */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.contactMessage.count({
      where: { isRead: false },
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.error("getUnreadCount error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ── ADMIN: Mark one message as read ─────────────────────────── */
export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data:  { isRead: true },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ── ADMIN: Delete a message ─────────────────────────────────── */
export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contactMessage.delete({ where: { id } });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("deleteContact error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};