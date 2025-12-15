import POSTSCHEMA from "../models/postModel.js";





//create post
export const createPost = async (req, res) => {
  try {
    const { title, short_desc, content, category } = req.body;

    const newPost = await POSTSCHEMA.create({
      title,
      short_desc,
      content,
      category,
      author: req.user._id,
      image: req.file ? req.file.path : "", // Cloudinary gives full URL here
    });
    console.log("FILE:", req.file);


    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all post

// GET all posts (admin or user)
export const getPost = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};

    if (category) filter.category = category;

    let posts;
    if (req.user.role === 'admin') {
      posts = await POSTSCHEMA.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name').sort({ createdAt: -1 }); // ✅ populate category name
    } else {
      filter.author = req.user._id;
      posts = await POSTSCHEMA.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name').sort({ createdAt: -1 }); // ✅ populate category name
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get single post
// GET single post
export const getSinglePost = async (req, res) => {
  try {
    const post = await POSTSCHEMA.findOne({ slug: req.params.slug })
      .populate('author', 'name')
      .populate('category', 'name');

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update post

export const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await POSTSCHEMA.findOne({ slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "unauthorized" });
    }

    post.title = req.body.title || post.title;
    post.short_desc = req.body.short_desc || post.short_desc;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    if (req.file) post.image = req.file.path;

    await post.save(); // slug auto-updates if title changed
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await POSTSCHEMA.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await POSTSCHEMA.deleteOne({ _id: post._id });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
