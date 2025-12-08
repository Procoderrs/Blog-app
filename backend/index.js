import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import createAdmin from './utils/createAdmin.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js'

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "https://blog-app-pi-five-79.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.options('*', cors());

// Routes
app.get("/", (req, res) => res.send("API is running"));

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/posts', postRoutes);
 app.use('/api/admin', adminRoutes); 
 app.use('/api/categories',categoryRoutes)

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect DB + Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
});

createAdmin();
