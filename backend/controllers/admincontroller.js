

import User from '../models/userModel.js';
import POSTSCHEMA from '../models/postModel.js'


//get all users

export const getAllUsers = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('-password').sort({ createdAt: -1 });
     console.log(users);
    // Add posts count for each user
    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        const postCount = await POSTSCHEMA.countDocuments({ author: user._id });
        return {
          ...user.toObject(),
          posts: postCount,
        };
      })
    );

    res.json(usersWithPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get all post

// admincontroller.js
export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params; 
    const { category, page = 1, limit = 6 } = req.query;

    const filter = { author: id };
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    const totalPosts = await POSTSCHEMA.countDocuments(filter);

    const posts = await POSTSCHEMA.find(filter)
      .populate("category", "name")
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      posts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
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

export const getAllPostsAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalPosts = await POSTSCHEMA.countDocuments();

    const posts = await POSTSCHEMA.find()
      .populate("author", "name email")
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
};
