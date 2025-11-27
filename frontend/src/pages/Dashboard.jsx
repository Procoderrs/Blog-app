import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";

const Dashboard = () => {
  const [expandedPost, setExpandedPost] = useState({});
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch all posts initially
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async (categoryId = "") => {
    try {
      const url = categoryId ? `/posts?category=${categoryId}` : "/posts";
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBlogs(res.data);
      console.log(res);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(res.data);
      console.log(categories);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setShowDropdown(false);
    fetchPosts(catId);
  };

  const getPreview = (text, words = 0) => {
    if (!text) return "";
    const wordArray = text.split(" ");
    return wordArray.length > words
      ? wordArray.slice(0, words).join(" ") + "..."
      : text;
  };
console.log('categories',categories);
console.log('posts',blogs);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />

      {/* INSIGHTS & UPDATES */}
      <div className="w-full py-12 px-6 border flex flex-col items-center justify-center bg-[#f9f5ff] rounded-xl shadow mb-6 text-center">
        <h2 className="text-4xl font-extrabold text-purple-800 mb-3 tracking-wide">
          Insights & Updates
        </h2>
        <span className="text-purple-900 font-semibold text-lg bg-purple-200 px-4 py-2 rounded-full shadow">
          ✨ Our Blog ✨
        </span>
        {user.role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-purple-700 px-4 py-2 rounded text-white mt-4"
          >
            Admin Panel
          </button>
        )}
      </div>

      {/* CATEGORY DROPDOWN */}
      <div className="relative w-64 mb-6">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full bg-purple-600 text-white px-4 py-2 rounded shadow flex justify-between items-center"
        >
          {selectedCategory
            ? categories.find((c) => c._id === selectedCategory)?.name
            : "Select Category"}
          <span className="ml-2">&#9662;</span>
        </button>

        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute mt-1 w-full bg-white shadow rounded z-50"
          >
            <button
              onClick={() => handleCategorySelect("")}
              className={`block w-full text-left px-4 py-2 hover:bg-purple-100 ${
                selectedCategory === "" ? "font-bold text-purple-700" : ""
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`block w-full text-left px-4 py-2 hover:bg-purple-100 ${
                  selectedCategory === cat._id ? "font-bold text-purple-700" : ""
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* POSTS GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 auto-rows-min">
        <AnimatePresence mode="popLayout">
          {blogs.length > 0 ? (
            blogs.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="backdrop-blur-md bg-[#f9f5ff] rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                {post.image && (
                  <img
  src={`${import.meta.env.VITE_BACKEND_URI}${post.image}`}
  alt={post.title}
  className="h-64 p-3 rounded-2xl w-full object-cover"
/>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex gap-2 items-start justify-between">
                    <h2 className="text-xl font-bold mb-2 line-clamp-1">{post.title}</h2>
                    <button
                      onClick={() => navigate(`/post/${post._id}`)}
                      className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                      <i className="ri-arrow-right-up-long-line text-lg font-black text-purple-900"></i>
                    </button>
                  </div>
                  {post.category && (
                    <motion.span
                      layout
                      className="inline-block bg-purple-200 text-purple-900 px-3 py-1 rounded-full font-semibold mb-2 text-sm animate-pulse"
                    >
                      {post.category.name}
                    </motion.span>
                  )}
                  <p className="text-gray-700 mb-2 line-clamp-1">{post.short_desc}</p>
                  <div
                    className="prose max-w-full mb-2"
                    dangerouslySetInnerHTML={{
                      __html: expandedPost[post._id] ? post.content : getPreview(post.content, 0),
                    }}
                  />
                  <div className="flex gap-4 items-center">
                  <div>
                    <img src="/profile.jpg" alt="" className="w-12 rounded-full" />
                  </div>
               <div>
                 <p className="font-bold" style={{fontFamily: 'Happy Monkey'}}>{user.name}</p>
                <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
               </div>
                </div>
                </div>
                
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 col-span-full mt-10"
            >
              No posts found in this category.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
