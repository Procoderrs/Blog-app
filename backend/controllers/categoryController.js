import Category from "../models/categoryModel.js";

// GET all categories
// Admin sees ALL, User sees admin/global + their own
export const getCategories = async (req, res) => {
  try {
    const { _id: userId, role } = req.user;

    let filters = {};
    if (role !== "admin") {
      // User: only their own + admin/global categories
      filters = {
        $or: [
          { createdBy: userId },     // user's categories
          { createdBy: null },       // global/admin categories
          { createdBy: { $exists: false } }
        ]
      };
    }

    const cats = await Category.find(filters).sort({ createdAt: -1 });

    // Add createdByRole field for frontend
    const mappedCats = cats.map(cat => ({
      ...cat.toObject(),
      createdByRole: cat.createdBy ? "user" : "admin"
    }));

    res.json(mappedCats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch categories" });
  }
};

// CREATE category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: "Name is required" });

    const cat = await Category.create({
      name,
      // Admin creates global categories (createdBy = null), user creates personal categories
      createdBy: req.user.role === "admin" ? null : req.user._id
    });

    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create category" });
  }
};

// UPDATE category
export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ msg: "Category not found" });

    // Admin can edit any category; user only their own
    if (req.user.role !== "admin" && cat.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed to edit this category" });
    }

    cat.name = req.body.name || cat.name;
    await cat.save();

    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update category" });
  }
};

// DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ msg: "Category not found" });

    // Admin can delete any category; user only their own
    if (req.user.role !== "admin" && cat.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Not allowed to delete this category" });
    }

    await cat.deleteOne();
    res.json({ msg: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete category" });
  }
};


//get public ctaegories
// GET public categories
export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    const mappedCats = categories.map(cat => ({
      ...cat.toObject(),
      createdByRole: cat.createdBy ? "user" : "admin"
    }));

    res.json(mappedCats);
  } catch (err) {
    console.error("Public categories error:", err);
    res.status(500).json({ msg: "Failed to fetch categories" });
  }
};