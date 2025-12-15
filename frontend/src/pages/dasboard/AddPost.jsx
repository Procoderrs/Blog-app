// src/pages/dashboard/AddPost.jsx
import { useState, useContext, useEffect } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Editor from "../../components/Editor";

export default function AddPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCategories(res.data || []);
      } catch (error) {
        console.log("Fetch categories error:", error.response?.data || error.message);
      }
    };
    fetchCategories();
  }, [user]);

  // Image preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));

    setErrors((prev) => ({ ...prev, image: "" }));
  };

  // Validation Function
  const validateForm = () => {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required.";
    if (!shortDesc.trim()) newErrors.shortDesc = "Short description is required.";
    if (!selectedCategory) newErrors.category = "Category is required.";
    if (!content.trim()) newErrors.content = "Content is required.";
    if (!image) newErrors.image = "Image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // ⛔ hard stop
  if (!validateForm()) return;

  setIsSubmitting(true);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("short_desc", shortDesc);
  formData.append("content", content);
  formData.append("category", selectedCategory);
  formData.append("image", image);

  try {
    const res = await api.post("/posts/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user?.token}`,
      },
    });

    alert("Post created successfully!");
    navigate("/");
  } catch (err) {
    console.error("Post creation error:", err.response?.data || err.message);
    setErrors({ submit: err.response?.data?.message || "Failed to create post." });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 bg-purple-50 p-3 md:p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Post title"
            className={`w-full border p-2 rounded ${errors.title ? "border-red-500" : ""}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        {/* Short Description */}
        <div>
          <input
            type="text"
            placeholder="Short description"
            className={`w-full border p-2 rounded ${errors.shortDesc ? "border-red-500" : ""}`}
            value={shortDesc}
            onChange={(e) => {
              setShortDesc(e.target.value);
              setErrors((prev) => ({ ...prev, shortDesc: "" }));
            }}
          />
          {errors.shortDesc && <p className="text-red-500 text-sm">{errors.shortDesc}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-black text-lg mb-2">Upload image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className={`${errors.image ? "border-red-500" : ""}`}
          />

          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 object-cover rounded border mt-2"
            />
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setErrors((prev) => ({ ...prev, category: "" }));
            }}
            className={`w-full border px-3 py-2 rounded ${errors.category ? "border-red-500" : ""}`}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        {/* Content */}
        <div>
          <label className="block font-semibold mb-2">Content</label>

          <div className={errors.content ? "border border-red-500 rounded" : ""}>
            <Editor content={content} onChange={(v) => {
              setContent(v);
              setErrors((prev) => ({ ...prev, content: "" }));
            }} />
          </div>

          {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
        </div>

        {/* Submit */}
        <button
  type="submit"
  disabled={isSubmitting}
  className={`w-full p-3 rounded font-semibold text-white
    ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`}
>
  {isSubmitting ? "Publishing..." : "Publish Post"}
</button>
      </form>

      {errors.submit && (
        <p className="bg-red-100 text-red-700 p-3 rounded border border-red-300 mt-4">
          {errors.submit}
        </p>
      )}
    </div>
  );
}
