import Category from '../models/categoryModel.js';




/// GET all categories
// Admin sees ALL, User sees admin categories + their own
export const getCategories = async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  let filters = {};

  if (role !== "admin") {
    filters = {
      $or: [
        { createdBy: userId },     // user's categories
        { createdBy: null },       // admin/global categories
        { createdBy: { $exists: false } }
      ]
    };
  }

  const cats = await Category.find(filters).sort({ createdAt: -1 });
  res.json(cats);
};

// POST create category
export const createCategory = async (req, res) => {
  const cat = await Category.create({
    name: req.body.name,
    createdBy: req.user.role === "admin" ? null : req.user._id
  });

  res.status(201).json(cat);
};

// PUT update category
export const updateCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);

  if (!cat) return res.status(404).json({ msg: "Category not found" });

  // Only creator can update (admin cannot edit user categories)
  if (cat.createdBy?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: "Not allowed to edit this category" });
  }

  cat.name = req.body.name;
  await cat.save();

  res.json(cat);
};

// DELETE category
export const deleteCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);

  if (!cat) return res.status(404).json({ msg: "Category not found" });

  // Only creator can delete
  if (cat.createdBy?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: "Not allowed to delete this category" });
  }

  await cat.deleteOne();

  res.json({ msg: "Category deleted" });
};
