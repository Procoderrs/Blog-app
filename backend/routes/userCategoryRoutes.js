import express from 'express';
import protect from '../middleware/authMidleware.js';
import { createCategory,getCategories,updateCategory,deleteCategory } from '../controllers/categoryController.js';

const router=express.Router();

//All posts are protect no admin specific needed

router.post('/',protect,createCategory)
router.get('/',protect,getCategories);
router.put('/:id',protect,updateCategory);
router.delete('/:id',protect,deleteCategory)

export default router;