import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

// For v2.x use DEFAULT IMPORT
import CloudinaryStorage from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

export default upload;
