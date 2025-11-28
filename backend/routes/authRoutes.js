import express from 'express';
import { registerUser,loginUser } from '../controllers/authControllers.js';
import protect from '../middleware/authMidleware.js';

const router=express.Router();

router.post('/register',protect,registerUser);
router.post('/login',protect,loginUser);

export default router;