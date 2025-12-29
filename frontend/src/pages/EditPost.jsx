import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import Editor from "../components/Editor";

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const API_URI = import.meta.env.VITE_API_URI;

  // ===============================
  // Form State
  // ===============================
  const [title, setTitle] = useState("");
  const [short_desc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ===============================
  // Fetch post details on mount
  // ===============================
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/slug/${slug}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });

        setTitle(res.data.title);
        setShortDesc(res.data.short_desc);
        setContent(res.data.content);
        setPreview(`${API_URI}${res.data.image}`);
      } catch (err) {
        console.error("Fetch post error:", err.response?.data || err.message);
      }
    };

    fetchPost();
  }, [slug, user, API_URI]);

  // ===============================
  // Handle image upload & preview
  // ===============================
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ===============================
  // Handle post update
  // ===============================
  const handleUpdate = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", title);
    fd.append("short_desc", short_desc);
    fd.append("content", content);
    if (image) fd.append("image", image);

    try {
      await api.put(`/posts/update/slug/${slug}`, fd, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to update post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-purple-50 p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Post Title"
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Short Description */}
        <input
          type="text"
          placeholder="Short Description"
          className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          value={short_desc}
          onChange={(e) => setShortDesc(e.target.value)}
        />

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-semibold cursor-pointer">Change Image</label>
          <input type="file" onChange={handleImage} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 cursor-pointer mt-2 rounded border"
            />
          )}
        </div>

        {/* Rich Text Editor */}
        <Editor content={content} onChange={setContent} />

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded w-full font-semibold transition"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPost;
