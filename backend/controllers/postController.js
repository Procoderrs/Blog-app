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

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all post

export const getPost = async (req, res) => {
  try {
    const { category } = req.query; // <-- get category from query
    let filter = {};

    if (category) {
      filter.category = category; // filter by category ObjectId
    }

    let posts;
    if (req.user.role === 'admin') {
      posts = await POSTSCHEMA.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name'); // populate category name
    } else {
      filter.author = req.user._id;
      posts = await POSTSCHEMA.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name');
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get single post
export const getSinglePost=async(req,res)=>{
try {
  const post=await POSTSCHEMA.findById(req.params.id).populate('author','name');
  if(!post) return res.status(404).json({message:'post not found'});
  res.json(post);
} catch (error) {
  res.status(500).json({message:error.message});
}
}
//update post

export const updatePost=async (req,res)=>{
  try {
    const {id}=req.params;
    const post=await POSTSCHEMA.findById(id);
    if(!post) return res.status(404).json({message:'post not found'});

    //only author and admin can update
    if(post.author.toString() !==req.user._id.toString() && req.user.role !=='admin'){
      return res.status(403).json({message:'unauthorized'});
    }

    //update fields
    post.title= req.body.title || post.title;
    post.short_desc=req.body.short_desc || post.short_desc;
    post.content=req.body.content|| post.content;

   if (req.file) {
      post.image = req.file.path; // Cloudinary URL
    }

    await post.save();
    res.json({message:'post update successfully',post});
  } catch (error) {
    console.log(error);
  res.status(500).json({message:error.message})
  }
}

export const deletePost=async(req,res)=>{
  try {
    const {id}=req.params;
    const post=await POSTSCHEMA.findById(id);
    if(!post) return res.status(404).json({message:'post not found'});

    //only author  or admin
    if(post.author.toString() !==req.user._id.toString() && req.user.role !=='admin'){
      return res.status(403).json({message:'unauthorized'});
    }
    await POSTSCHEMA.findByIdAndDelete(id)
    res.json({message:'post deleted successfully'})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}
