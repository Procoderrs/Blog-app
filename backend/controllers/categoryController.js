import Category from "../models/categoryModel.js";


// GET categories
export const getCategories = async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  let filters = {};

  if (role !== "admin") {
    filters = {
      $or: [
        { createdBy: userId }, 
        { createdBy: null }, 
        { createdBy: { $exists: false } }
      ]
    };
  }

  const cats = await Category.find(filters).sort({ createdAt: -1 });
  res.json(cats);
};


// CREATE category
export const createCategory = async (req, res) => {
  const createdBy = req.user.role === "admin" ? null : req.user._id;

  const cat = await Category.create({
    name: req.body.name,
    createdBy
  });

  res.status(201).json(cat);
};


// UPDATE category
export const updateCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);

  if (!cat) return res.status(404).json({ msg: "Category not found" });

  if (String(cat.createdBy) !== String(req.user._id)) {
    return res.status(403).json({ msg: "Not allowed to edit this category" });
  }

  cat.name = req.body.name;
  await cat.save();

  res.json(cat);
};


// DELETE category
// DELETE category
export const deleteCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);

  if (!cat) return res.status(404).json({ msg: "Category not found" });

  // Admin can delete any category, user can delete only their own
  if (req.user.role !== "admin" && cat.createdBy?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: "Not allowed to delete this category" });
  }

  await cat.deleteOne();
  res.json({ msg: "Category deleted" });
};

