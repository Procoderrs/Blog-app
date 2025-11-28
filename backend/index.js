import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import createAdmin from './utils/createAdmin.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js'
import adminRoutes from './routes/adminRoutes.js'


dotenv.config();
connectDB();
createAdmin();

const app=express();


app.use(
	cors({
		origin: [
 			"https://blog-app-74bn.vercel.app",
 			"http://localhost:5173",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/uploads',express.static('uploads'));
app.use('/api/posts',postRoutes);
app.use('/api/admin',adminRoutes)

app.use('/',(req,res)=>res.send('api is runningnnnnnnnnn'));



const PORT=process.env.PORT||5001;
app.listen(PORT,()=>console.log(`server is running on port${PORT}`))