

import User from '../models/userModel.js';
import POSTSCHEMA from '../models/postModel.js'


//get all users

export const getAllUsers=async(req,res)=>{
  try {
    const users=await User.find().select('-password');
    res.json(users);

  } catch (error) {
    res.status(500).json({message:error.message});
  }
}


//get all post

export const getUserPosts=async(req,res)=>{
  try {
    const userId=req.params.id;

    const posts=await POSTSCHEMA.find({author:userId}).populate('author','name email');

    res.json(posts);
    console.log(posts);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}