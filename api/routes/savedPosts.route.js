import express from "express";
import {
  toggleSavePost,
  getSavedPosts,
  checkSavedPost,
  deleteSavedPost,
} from "../controllers/savePost.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//  Protected routes (login required)
router.post("/:postId", verifyToken, toggleSavePost);
router.get("/", verifyToken, getSavedPosts);
router.get("/check/:postId", verifyToken, checkSavedPost);
router.delete("/:postId", verifyToken, deleteSavedPost);

export default router;