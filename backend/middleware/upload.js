import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import { Readable } from "stream";

// Memory storage for multer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Middleware to upload file to Cloudinary
export const handleImageUpload = async (req, res, next) => {
  try {
    if (!req.file) return next(); // no file

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blog_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      const readable = new Readable();
      readable._read = () => {};
      readable.push(req.file.buffer);
      readable.push(null);
      readable.pipe(stream);
    });

    req.file.path = result.secure_url; // set URL for controller
    next();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

export default upload;
