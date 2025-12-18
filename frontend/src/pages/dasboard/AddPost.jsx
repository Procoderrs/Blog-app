import { useState, useContext, useEffect } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Editor from "../../components/Editor";
import imageCompression from "browser-image-compression";

export default function AddPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Generate slug dynamically when title changes
  useEffect(() => {
    const generateSlug = (text) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
    setSlug(generateSlug(title));
  }, [title]);

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

  const handleImage = async (e) => {
    let file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max size is 10MB.");
      return;
    }

    const options = { maxSizeMB: 2, maxWidthOrHeight: 1920, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);
      setPreview(URL.createObjectURL(compressedFile));
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch (err) {
      console.error("Image compression error:", err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("short_desc", shortDesc);
    formData.append("content", content);
    formData.append("category", selectedCategory);
    formData.append("image", image);

    try {
      await api.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${user?.token}` },
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
    <div className="w-full max-w-4xl mx-auto mt-10 bg-white p-6 md:p-8 rounded-2xl shadow-sm">
      <h1 className="text-2xl md:text-3xl text-[#3b3363] font-bold mb-8 tracking-tight">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#E5E7EB] px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/40"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <input
            type="text"
            placeholder="Slug"
            value={slug}
            readOnly
            className="w-full border border-[#E5E7EB] outline-none px-3 py-2.5 rounded-lg bg-[#F5F6FA] text-[#6B7280]"
          />
        </div>

        {/* Short Description */}
        <div>
          <input
            type="text"
            placeholder="Short description"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full border border-[#E5E7EB] px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/40"
          />
          {errors.shortDesc && <p className="text-red-600 text-sm mt-1">{errors.shortDesc}</p>}
        </div>

        {/* Image */}
        <div>
<label className="block mb-2 text-sm font-medium text-[#3B3363]">
  Featured Image
</label>          <input type="file" className="font-medium cursor-pointer hover:bg-purple-50 w-fit " accept="image/*" onChange={handleImage} />
          {preview && <img
  src={preview}
  alt="preview"
  className="w-40 h-40 object-cover rounded-xl border border-[#E5E7EB] mt-3"
/>}
          {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Category */}
        <div>
          <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="w-full border border-[#E5E7EB] px-3 py-2.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]/40"
>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Content */}
        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
  <Editor content={content} onChange={setContent} />
</div>

        {/* Submit */}
        <button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 rounded-lg font-semibold text-white bg-[#7C6EE6] hover:bg-[#6A5BE2] transition disabled:opacity-50"
>
          {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>

        {errors.submit && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4">
  {errors.submit}
</p>}
      </form>
    </div>
  );
}
