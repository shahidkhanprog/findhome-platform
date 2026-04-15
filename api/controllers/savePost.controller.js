import prisma from "../lib/prisma.js";

/* ═════════════════════════════════════════════════════════════════════════════
   TOGGLE SAVE / UNSAVE POST
═════════════════════════════════════════════════════════════════════════════ */
export const toggleSavePost = async (req, res) => {
  const userId = req.userId;
  const { postId } = req.params;

  try {
    // Check post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if already saved
    const existing = await prisma.savePost.findFirst({
      where: { userId, postId },
    });

    if (existing) {
      await prisma.savePost.delete({
        where: { id: existing.id },
      });

      return res.status(200).json({
        message: "Post removed from saved",
        saved: false,
      });
    }

    // Save new
    await prisma.savePost.create({
      data: { userId, postId },
    });

    res.status(201).json({
      message: "Post saved successfully",
      saved: true,
    });
  } catch (error) {
    console.error("Toggle Save Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ═════════════════════════════════════════════════════════════════════════════
   GET ALL SAVED POSTS
═════════════════════════════════════════════════════════════════════════════ */
export const getSavedPosts = async (req, res) => {
  const userId = req.userId;

  try {
    const savedPosts = await prisma.savePost.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            postDetails: true,
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(savedPosts);
  } catch (error) {
    console.error("Get Saved Posts Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ═════════════════════════════════════════════════════════════════════════════
   CHECK IF POST IS SAVED
═════════════════════════════════════════════════════════════════════════════ */
export const checkSavedPost = async (req, res) => {
  const userId = req.userId;
  const { postId } = req.params;

  try {
    const saved = await prisma.savePost.findFirst({
      where: { userId, postId },
    });

    res.status(200).json({
      saved: !!saved,
    });
  } catch (error) {
    console.error("Check Saved Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ═════════════════════════════════════════════════════════════════════════════
   DELETE SAVED POST
═════════════════════════════════════════════════════════════════════════════ */
export const deleteSavedPost = async (req, res) => {
  const userId = req.userId;
  const { postId } = req.params;

  try {
    const existing = await prisma.savePost.findFirst({
      where: { userId, postId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Saved post not found" });
    }

    await prisma.savePost.delete({
      where: { id: existing.id },
    });

    res.status(200).json({
      message: "Saved post deleted successfully",
    });
  } catch (error) {
    console.error("Delete Saved Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};