// src/pages/UpdatePost.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Editor from "../components/Editor";
import Header from "../components/Header";

export default function UpdatePost() {
  console.log('update-render');
  const {user}=useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {}; // get post data from state

  if (!post) {
    return <p>No post selected for update.</p>;
  }

  const [title, setTitle] = useState(post.title);
  const [shortDesc, setShortDesc] = useState(post.short_desc);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(post.image ? `http://localhost:5000${post.image}` : null);

  // Image preview
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
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await api.put(`/posts/update/${post._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${user.token}`
        },
      });
      alert("Post updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <>
    <Header/>
    <div className="max-w-4xl mx-auto my-10 bg-purple-50 p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Update Post</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Post title"
          className="w-full border p-2 rounded outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Short description"
          className="w-full border p-2 rounded outline-none"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
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
