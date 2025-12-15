import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import cloudinaryStorage from "multer-storage-cloudinary"; // default import

// Create Cloudinary storage
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "blog_images",
  allowedFormats: ["jpg", "jpeg", "png", "webp"],
  transformation: [{ width: 1200, height: 800, crop: "limit" }],
});

// Multer upload using Cloudinary storage
const upload = multer({ storage });

export default upload;
