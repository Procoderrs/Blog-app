import express from 'express';
import upload from '../middleware/upload.js';
import {createPost,deletePost,getPost, getSinglePost, updatePost} from '../controllers/postController.js';
import protect from '../middleware/authMidleware.js';
import POSTSCHEMA from '../models/postModel.js';
 
const router=express.Router();

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