// controllers/post.controller.js

import prisma from "../lib/prisma.js";

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

const canModify = (tokenUserId, isAdmin, post) =>
  isAdmin || post.userId === tokenUserId;

/* ═════════════════════════════════════════════════════════════════════════════
   PUBLIC — no auth required
═════════════════════════════════════════════════════════════════════════════ */
export const getAllPosts = async (req, res) => {
  const { city, listingType, property, minPrice, maxPrice, bedroom } =
    req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(listingType && { listingType: listingType }),
        ...(property && { property: property }),
        ...(bedroom && { bedroom: parseInt(bedroom, 10) }),
        ...((minPrice || maxPrice) && {
          price: {
            ...(minPrice && { gte: parseInt(minPrice, 10) }),
            ...(maxPrice && { lte: parseInt(maxPrice, 10) }),
          },
        }),
      },
      include: {
        postDetails: true,
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postDetails: true,
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ═════════════════════════════════════════════════════════════════════════════
   AUTHENTICATED — requires valid JWT
═════════════════════════════════════════════════════════════════════════════ */

export const createPost = async (req, res) => {
  const tokenUserId = req.userId;

  const {
    title,
    price,
    images,
    address,
    city,
    bedroom,
    bathroom,
    latitude,
    longitude,
    listingType,
    property,
    status,
    // postDetails fields (optional — can be added in same request)
    desc,
    utilities,
    pet,
    income,
    size,
    school,
    bus,
    restaurant,
  } = req.body;

  // Basic required field check
  if (
    !title ||
    !price ||
    !address ||
    !city ||
    !latitude ||
    !longitude ||
    !listingType ||
    !property
  ) {
    return res.status(400).json({ message: "Missing required post fields" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        userId: tokenUserId,
        title: title.trim(),
        price: parseInt(price, 10),
        images: images ?? [],
        address: address.trim(),
        city: city.trim(),
        bedroom: parseInt(bedroom, 10),
        bathroom: parseInt(bathroom, 10),
        latitude: latitude.toString().trim(),
        longitude: longitude.toString().trim(),
        listingType,
        property,
        status: status ?? "available",

        // Create postDetails in the same transaction if fields provided
        ...(desc && {
          postDetails: {
            create: {
              desc: desc.trim(),
              utilities: utilities ?? "",
              pet: pet ?? "",
              income: income ? income.trim() : "",
              size: size ? parseInt(size, 10) : 0,
              school: school ? parseInt(school, 10) : 0,
              bus: bus ? parseInt(bus, 10) : 0,
              restaurant: restaurant ? parseInt(restaurant, 10) : 0,
            },
          },
        }),
      },
      include: { postDetails: true },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPostDetails = async (req, res) => {
  const tokenUserId = req.userId;
  const isAdmin = req.isAdmin;

  const {
    postId,
    desc,
    utilities,
    pet,
    income,
    size,
    school,
    bus,
    restaurant,
  } = req.body;

  if (!postId || !desc || !size) {
    return res
      .status(400)
      .json({ message: "Missing required postDetails fields" });
  }

  try {
    // Verify post exists and requester owns it (or is admin)
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!canModify(tokenUserId, isAdmin, post)) {
      return res
        .status(403)
        .json({
          message: "Forbidden: You can only add details to your own posts",
        });
    }

    const details = await prisma.postDetail.create({
      data: {
        postId,
        desc: desc.trim(),
        utilities,
        pet,
        income: (income || "").trim(),
        size: parseInt(size, 10),
        school: school ? parseInt(school, 10) : 0,
        bus: bus ? parseInt(bus, 10) : 0,
        restaurant: restaurant ? parseInt(restaurant, 10) : 0,
      },
    });

    res.status(201).json(details);
  } catch (error) {
    console.error("Error creating post details:", error);
    res.status(500).json({ message: "Internal server error ss" });
  }
};

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const tokenUserId = req.userId;
  const isAdmin = req.isAdmin;

  try {
    const existing = await prisma.post.findUnique({
      where: { id: postId },
      include: { postDetails: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!canModify(tokenUserId, isAdmin, existing)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own posts" });
    }

    const {
      title,
      price,
      images,
      address,
      city,
      bedroom,
      bathroom,
      latitude,
      longitude,
      listingType,
      property,
      status,
      // postDetails fields
      desc,
      utilities,
      pet,
      income,
      size,
      school,
      bus,
      restaurant,
    } = req.body;

    // Build post update payload — only include fields that were sent
    const postData = {
      ...(title !== undefined && { title: title.trim() }),
      ...(price !== undefined && { price: parseInt(price, 10) }),
      ...(images !== undefined && { images }),
      ...(address !== undefined && { address: address.trim() }),
      ...(city !== undefined && { city: city.trim() }),
      ...(bedroom !== undefined && { bedroom: parseInt(bedroom, 10) }),
      ...(bathroom !== undefined && { bathroom: parseInt(bathroom, 10) }),
      ...(latitude !== undefined && { latitude: latitude.toString().trim() }),
      ...(longitude !== undefined && {
        longitude: longitude.toString().trim(),
      }),
      ...(listingType !== undefined && { listingType }),
      ...(property !== undefined && { property }),
      ...(status !== undefined && { status }),
    };

    // Build postDetails upsert payload
    const hasDetailsUpdate = [
      desc,
      utilities,
      pet,
      income,
      size,
      school,
      bus,
      restaurant,
    ].some((v) => v !== undefined);

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...postData,
        ...(hasDetailsUpdate && {
          postDetails: {
            upsert: {
              create: {
                desc: desc ? desc.trim() : "",
                utilities: utilities ?? "",
                pet: pet ?? "",
                income: income ? income.trim() : "",
                size: size ? parseInt(size, 10) : 0,
                school: school ? parseInt(school, 10) : 0,
                bus: bus ? parseInt(bus, 10) : 0,
                restaurant: restaurant ? parseInt(restaurant, 10) : 0,
              },
              update: {
                ...(desc !== undefined && { desc: desc.trim() }),
                ...(utilities !== undefined && { utilities }),
                ...(pet !== undefined && { pet }),
                ...(income !== undefined && { income: income.trim() }),
                ...(size !== undefined && { size: parseInt(size, 10) }),
                ...(school !== undefined && { school: parseInt(school, 10) }),
                ...(bus !== undefined && { bus: parseInt(bus, 10) }),
                ...(restaurant !== undefined && {
                  restaurant: parseInt(restaurant, 10),
                }),
              },
            },
          },
        }),
      },
      include: { postDetails: true },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const tokenUserId = req.userId;
  const isAdmin = req.isAdmin;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!canModify(tokenUserId, isAdmin, post)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own posts" });
    }

    // Delete related records first (MongoDB doesn't support cascades automatically)
    await prisma.postDetail.deleteMany({ where: { postId } });
    await prisma.savePost.deleteMany({ where: { postId } });
    await prisma.post.delete({ where: { id: postId } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  const targetUserId = req.params.userId;
  const tokenUserId = req.userId;
  const isAdmin = req.isAdmin;

  // Users can only view their own posts list; admins can view anyone's
  if (tokenUserId !== targetUserId && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: You can only view your own posts" });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { userId: targetUserId },
      include: { postDetails: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Only return posts that are available and whose owners are active (for public listing page)

export const getActiveOwnerPosts = async (req, res) => {
  const { city, listingType, property, minPrice, maxPrice, bedroom } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "available",
        user: {
          isActive: true,
        },
        ...(city && { city: { contains: city, mode: "insensitive" } }),
        ...(listingType && { listingType }),
        ...(property && { property }),
        ...(bedroom && { bedroom: parseInt(bedroom, 10) }),
        ...((minPrice || maxPrice) && {
          price: {
            ...(minPrice && { gte: parseInt(minPrice, 10) }),
            ...(maxPrice && { lte: parseInt(maxPrice, 10) }),
          },
        }),
      },
      include: {
        postDetails: true,
        user: {
          select: { id: true, username: true, avatar: true, isActive: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching active owner posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};