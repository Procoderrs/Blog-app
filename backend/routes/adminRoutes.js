import express from 'express';
import adminOnly from '../middleware/onlyAdmin.js';
import { createCategory, getCategories,updateCategory,deleteCategory } from '../controllers/categoryController.js';
import {getAllUsers,getUserPosts} from '../controllers/admincontroller.js'
import protect from '../middleware/authMidleware.js';

const router = express.Router();

router.post('/category', protect, adminOnly, createCategory);
router.get('/categories' , getCategories);

// adminRoutes.js
router.put("/category/:id", protect, adminOnly, updateCategory);
router.delete("/category/:id", protect, adminOnly, deleteCategory);


router.get('/users',protect,adminOnly,getAllUsers);
router.get('/users/:id/posts',protect,adminOnly,getUserPosts)

export default router;
