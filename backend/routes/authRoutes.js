import express from 'express';
import { registerUser,loginUser } from '../controllers/authControllers.js';
import protect from '../middleware/authMidleware.js';

const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);

export default router;