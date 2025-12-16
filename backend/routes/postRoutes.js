import express from "express";
import upload , { handleImageUpload }  from "../middleware/upload.js"; // just the upload middleware
import {createPost,deletePost,getPost,getSinglePost,updatePost,
} from "../controllers/postController.js";
import protect from "../middleware/authMidleware.js";
import POSTSCHEMA from "../models/postModel.js";


/* ---------------------------------------------------
   PUBLIC ROUTES
--------------------------------------------------- */



const router = express.Router();

/* ---------------------------------------------------
   PUBLIC ROUTES
--------------------------------------------------- */

// Public list posts with optional category filter
router.get("/public", async (req, res) => {
  try {
    const { category } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const filter = {};
    if (category) filter.category = category;

    const totalPosts = await POSTSCHEMA.countDocuments(filter);

    const posts = await POSTSCHEMA.find(filter)
      .populate("author", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});







// Public get single post
router.get("/public/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await POSTSCHEMA.findOne({ slug })
      .populate("author", "name")
      .populate("category", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Single public post error:", error);
    res.status(500).json({ message: error.message });
  }
});


/* ---------------------------------------------------
   USER PROTECTED ROUTES
--------------------------------------------------- */

// Create user post
router.post("/create",protect,upload.single("image"),handleImageUpload, createPost);

// Get all posts for logged-in user
router.get("/", protect, getPost);

// Get a single post for logged in user
router.get("/slug/:slug", protect, getSinglePost);

// Update
router.put("/update/slug/:slug",protect,upload.single("image"),handleImageUpload,updatePost);

// Delete
router.delete("/delete/slug/:slug", protect, deletePost);

/* ---------------------------------------------------
   UNIVERSAL FILTER ROUTE
   (used by user dashboard and admin dashboard)
--------------------------------------------------- */

router.get("/filter/all", async (req, res) => {
	const { category } = req.query;

	const filter = {};
	if (category) filter.category = category;

	try {
		const posts = await POSTSCHEMA.find(filter).populate("category", "name");
		res.json(posts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
