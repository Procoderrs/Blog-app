import React, { useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from '../context/AuthContext';

export default function Reader() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const navigate = useNavigate();

  const {user}=useContext(AuthContext)

  // Load categories + posts
  useEffect(() => {
    loadCategories();
    loadPosts();
  }, []);

  // Load categories
 const loadCategories = async () => {
  try {
    setCategoriesLoading(true);
    const res = await api.get("/categories/public");
    setCategories(res.data || []);
  } catch (err) {
    console.log("Categories error:", err.response?.data || err.message);
          console.log("Selected catId:", catId);

  } finally {
    setCategoriesLoading(false);
  }
};
  // Load posts (with or without category)
  const loadPosts = async (category = "") => {
    try {
      setLoading(true);

      let url = "/posts/public";
      if (category) url += `?category=${category}`;

      const res = await api.get(url);

      const data = Array.isArray(res.data) ? res.data : [];
      setPosts(data);
      setAllPosts(data);


    } catch (err) {
      console.log("Posts error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Category selection handler
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setShowDropdown(false);
    loadPosts(catId);
  };

  return (
    <>
      <PublicHeader />

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Latest Blogs</h1>

        {/* Category Filter */}
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

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute mt-1 w-full bg-white shadow rounded z-50"
              >
                {/* All button */}
                <button
                  onClick={() => handleCategorySelect("")}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                >
                  All
                </button>

                {/* Category list */}
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat._id)}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                  >
                    {cat.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="w-full flex justify-center shadow-2xl py-20">
            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Posts */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-[#f9f5ff] rounded-xl shadow hover:shadow-lg transition p-4"
              >

                <div className="h-48 w-full overflow-hidden rounded-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <h2 className="text-xl font-bold mt-3 line-clamp-1">{post.title}</h2>

                {/* Category pill */}
                {post.category && (
                  <span className="inline-block bg-purple-200 w-full text-purple-900 my-2 px-3 py-1 rounded-full font-semibold text-sm">
                    {post.category.name}
                  </span>
                )}

                <p className="text-gray-700 hidden line-clamp-1">{post.short_desc}</p>

                <div className="flex gap-4 items-center mt-auto">
                  <img
                    src="/profile.jpg"
                    alt=""
                    className="w-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold">{post.author?.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/reader/post/${post.slug}`)}
                  className="text-blue-600 mt-2 hover:underline"
                >
                  Read more →
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-gray-600 text-center mt-10 text-lg">
            No posts found.
          </p>
        )}
      </div>
    </>
  );
}
