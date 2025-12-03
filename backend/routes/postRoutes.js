import express from 'express';
import upload from '../middleware/upload.js';
import {createPost,deletePost,getPost, getSinglePost, updatePost} from '../controllers/postController.js';
import protect from '../middleware/authMidleware.js';
import POSTSCHEMA from '../models/postModel.js';
 
const router=express.Router();


//public route- get all post reader mode
router.get('/public',async(req,res)=>{
  try {
    const posts=await POSTSCHEMA.find()
    .populate('author','name').populate('category','name');
   
     res.json(posts)

  } catch (error) {
     res.status(500).json({message:error.message});    
  }
})

router.get('/public/:id',async(req,res)=>{
  try {
    const post=await POSTSCHEMA.findById(req.params.id)
    .populate('author','name').populate('category','name');

    if(!post) return res.status(404).json({message:'not found'})

      res.json(post);
  } catch (error) {
    res.status(500).json({message:error.message})
  }
})



router.post('/create', protect,upload.single('image'),createPost);
router.get('/',protect,getPost)
router.get('/:id',protect,getSinglePost)
router.put('/update/:id',protect,upload.single('image'),updatePost)
router.delete('/delete/:id',protect,deletePost)


router.get("/posts", async (req, res) => {
  const { category } = req.query;

  let filter = {};
  if (category) filter.category = category;

  const posts = await POSTSCHEMA.find(filter).populate("category");
  res.json(posts);
});


export default router;