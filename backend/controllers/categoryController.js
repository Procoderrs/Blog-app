import Category from '../models/categoryModel.js';




//create-category
export const createCategory=async(req,res)=>{
try {
  const{name}=req.body;
/* Fix: Category.findOne(name) is invalid. It should be Category.findOne({ name }). */
  const exists=await Category.findOne({name,});
  if(exists) return res.status(400).json({message:'Category already exists'});

  const cat=await Category.create({name,user:req.user._id});

  res.status(201).json(cat);

} catch (error) {
  res.status(500).json({message:error.message});
}
}


//get all categories
export const getCategories=async(req,res)=>{
  try {
    const cats=await Category.find({user:req.user._id});
    res.json(cats);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}


//update category

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
     {_id:req.params.id,user:req.user._id,},
      { name },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//delete category
export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete({_id:req.params.id,user:req.user._id});
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
