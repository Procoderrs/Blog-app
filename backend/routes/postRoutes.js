import express from "express";
import upload, { handleImageUpload } from "../middleware/upload.js";
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
    const filter = {};

    if (category) filter.category = category; // filter by category ID if provided

    const posts = await POSTSCHEMA.find(filter)
      .populate("author", "name")          // populate author name
      .populate("category", "name")        // populate category name
      .sort({ createdAt: -1 });            // newest posts first

    res.json(posts);
  } catch (error) {
    console.error("Public posts fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});







// Public get single post
router.get("/public/:id", async (req, res) => {
	try {
		const post = await POSTSCHEMA.findById(req.params.id)
			.populate("author", "name")
			.populate("category", "name");

		if (!post) return res.status(404).json({ message: "not found" });
		res.json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

/* ---------------------------------------------------
   USER PROTECTED ROUTES
--------------------------------------------------- */

// Create user post
router.post("/create",protect,upload.single("image"),handleImageUpload,createPost);

// Get all posts for logged-in user
router.get("/", protect, getPost);

// Get a single post for logged in user
router.get("/:id", protect, getSinglePost);

// Update
router.put("/update/:id",protect,upload.single("image"),handleImageUpload,updatePost);

// Delete
router.delete("/delete/:id", protect, deletePost);

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
