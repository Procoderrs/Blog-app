import express from 'express';
import adminOnly from '../middleware/onlyAdmin.js';
import { createCategory, getCategories,updateCategory,deleteCategory } from '../controllers/categoryController.js';
import {deleteUser, getAllPostsAdmin, getAllUsers,getUserPosts} from '../controllers/admincontroller.js'
import protect from '../middleware/authMidleware.js';
import { deletePost } from '../controllers/postController.js';

const router = express.Router();

router.post('/category', protect, createCategory);
router.get('/categories' , getCategories);

// adminRoutes.js
router.put("/category/:id", protect,  updateCategory);
router.delete("/category/:id", protect, deleteCategory);

router.get('/users',protect,adminOnly,getAllUsers);
router.get('/users/:id/posts',protect,adminOnly,getUserPosts)
router.delete('/users/:id',protect,adminOnly,deleteUser)
router.delete('/:id',protect,adminOnly,deletePost)
router.get('/posts',protect,adminOnly,getAllPostsAdmin)

router.get("/me", protect, adminOnly,   (req, res) => {
  res.json(req.user);
  console.log(req.user)
});

export default router;
