// src/pages/dasboard/UpdatePost.jsx
import React, { useState, useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Editor from "../../components/Editor";
import Header from "../../components/Header";

export default function UpdatePost() {
  const { user } = useContext(AuthContext);
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // If navigated from dashboard, get post from state
  const [post, setPost] = useState(location.state?.post || null);

  // Form fields
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch categories and post if needed
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const cats = res.data || [];
      setCategories(cats);

      // If post exists, set selectedCategory from post
      if (post && post.category?._id) {
        setSelectedCategory(post.category._id);
      }
    } catch (err) {
      console.error("Fetch categories error:", err.response?.data || err.message);
    }
  };

  fetchCategories();
}, [user, post]);


  useEffect(() => {
    const fetchPost = async () => {
      if (!post) {
        try {
          const res = await api.get(`/posts/slug/${slug}`, {
            headers: { Authorization: `Bearer ${user?.token}` },
          });
          setPost(res.data);
          // Set form fields
          setTitle(res.data.title);
          setShortDesc(res.data.short_desc);
          setContent(res.data.content);
          setSelectedCategory(res.data.category?._id || "");
          setPreview(res.data.image || null);
        } catch (err) {
          console.error("Fetch post error:", err.response?.data || err.message);
        }
      } else {
        // Post exists from location.state
        setTitle(post.title);
        setShortDesc(post.short_desc);
        setContent(post.content);
        setSelectedCategory(post.category?._id || "");
        setPreview(post.image || null);
      }
    };

    fetchPost();
  }, [slug, post, user]);

  if (!post) return <p>Loading post...</p>;

  // Handle image preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit updated post
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_desc", shortDesc);
    formData.append("category", selectedCategory);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await api.put(`/posts/update/slug/${post.slug}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("Post updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update post");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto my-10 bg-purple-50 p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">Update Post</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Post title"
            className="w-full border p-2 rounded outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Short description"
            className="w-full border p-2 rounded outline-none"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            required
          />

          {/* Image upload */}
          <div>
            <label className="block font-semibold mb-2">Upload image</label>
            <input type="file" onChange={handleImage} />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded border mt-2"
              />
            )}
          </div>

          {/* Category Select */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Tiptap Editor */}
          <div>
            <label className="block font-semibold mb-2">Content</label>
            <Editor content={content} onChange={setContent} />
          </div>

          <button className="w-full bg-[#33006F] text-white p-3 rounded font-semibold">
            Update Post
          </button>
        </form>
      </div>
    </>
  );
}
