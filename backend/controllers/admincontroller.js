

import User from '../models/userModel.js';
import POSTSCHEMA from '../models/postModel.js'


//get all users

export const getAllUsers=async(req,res)=>{
  try {
    const users=await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);

  } catch (error) {
    res.status(500).json({message:error.message});
  }
}


//get all post

// admincontroller.js
export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params; // user ID
    const { category } = req.query; // new: optional category filter

    let filter = { author: id };
    if (category) filter.category = category;

    const posts = await POSTSCHEMA.find(filter)
      .populate("category", "name")
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//deleteUser
export const deleteUser=async(req,res)=>{
  try {
    const userId=req.params.id;

    //delete posts of this user
    await POSTSCHEMA.deleteMany({author:userId});
    await User.findByIdAndDelete(userId);

    res.json({message:'user and thier posts deleted successfully'});
  } catch (error) {
    res.status(500).json({message:error.message});
  }
}


//get all admin's post

export const getAllPostsAdmin=async(req,res)=>{
  try {
    const posts=await POSTSCHEMA.find().populate('author','name email').populate('category','name').sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({message:error.message})
  }
}