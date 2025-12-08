import Category from '../models/categoryModel.js';




//create-category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category exists globally or for this user
    const exists = await Category.findOne({
      name,
      $or: [{ user: null }, { user: req.user._id }],
    });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({
      name,
      user: req.user.role === "admin" ? null : req.user._id, // global for admin
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//get all categories
export const getCategories = async (req, res) => {
  try {
    let filter;
    if (req.user.role === "admin") {
      filter = {}; // admin sees all categories
    } else {
      filter = { $or: [{ user: null }, { user: req.user._id }] }; // global + personal
    }

    const categories = await Category.find(filter);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update category

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ message: "Category not found" });

    // Only admin can edit global categories
    if (category.user === null && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to edit this category" });
    }

    // Only owner can edit personal category
    if (category.user && category.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to edit this category" });
    }

    category.name = name;
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Only admin can delete global categories
    if (category.user === null && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this category" });
    }

    // Only owner can delete personal category
    if (category.user && category.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this category" });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
