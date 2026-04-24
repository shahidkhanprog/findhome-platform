// routes/post.route.js

import express from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  createPostDetails,
  updatePost,
  deletePost,
  getUserPosts,
  getActiveOwnerPosts,
  getPostStats,
} from "../controllers/post.controller.js";

import {
  verifyAdmin,
  verifyToken,
  verifyTokenOrAdmin,
} from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/active", getActiveOwnerPosts);
router.get("/stats",verifyTokenOrAdmin, getPostStats);
router.get("/:id", getPost);
router.post("/", verifyToken, createPost);
router.post("/details", verifyToken, createPostDetails);
router.put("/:id", verifyTokenOrAdmin, updatePost);
router.delete("/:id", verifyTokenOrAdmin, deletePost);
router.get("/user/:userId", verifyTokenOrAdmin, getUserPosts);


export default router;
