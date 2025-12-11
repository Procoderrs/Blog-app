// src/pages/dashboard/AddPost.jsx
import { useState, useContext, useEffect } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Editor from "../../components/Editor";

export default function AddPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch categories for the user
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

  // Handle image selection and preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title || !shortDesc || !content || !selectedCategory) {
      return setErrorMsg("Please fill all fields.");
    }
    if (!image) return setErrorMsg("Please upload an image.");

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

      console.log("Post created:", res.data);

      alert("Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Post creation error:", err.response?.data || err.message);
      setErrorMsg(err.response?.data?.message || "Failed to create post.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 bg-purple-50 p-3 md:p-8 rounded-lg shadow overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Post title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Short description"
          className="w-full border p-2 rounded"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
        />

        {/* Image upload */}
        <div>
          <label className="block font-black text-lg mb-2">Upload image</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 object-cover rounded border mt-2"
            />
          )}
        </div>

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Categoryyyy</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Editor */}
        <div>
          <label className="block font-semibold mb-2">Content</label>
          <Editor content={content} onChange={setContent} />
        </div>

        <button className="w-full bg-blue-600 text-white p-3 rounded font-semibold">
          Publish Post
        </button>
      </form>

      {errorMsg && (
        <p className="bg-red-100 text-red-700 p-3 rounded border border-red-300 mt-4">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
