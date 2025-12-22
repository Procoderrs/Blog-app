import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import PublicHeader from "../components/PublicHeader";
import Hero from "../components/Hero";

export default function ExploreBlogs() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load posts whenever page or category changes
  useEffect(() => {
    loadPosts(selectedCategory, page);
  }, [selectedCategory, page]);

  // Fetch categories
  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await api.get("/categories/public");
      setCategories(res.data || []);
    } catch (err) {
      console.log("Categories error:", err.response?.data || err.message);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch posts
  const loadPosts = async (category = "", pageNumber = 1) => {
    try {
      setLoading(true);
      let url = `/posts/public?page=${pageNumber}&limit=6`;
      if (category) url += `&category=${category}`;
      const res = await api.get(url);
      setPosts(res.data.posts || []);
      setPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log("Posts error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
   
      

      {/* Hero */}
      {posts.length > 0 && <Hero featuredPost={posts[0]} />}

      <div className="max-w-6xl mx-auto px-6">

        {/* Category Filter */}
        {!categoriesLoading && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white py-10 rounded-xl shadow-md mb-10 flex flex-wrap gap-4 justify-center"
          >
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategorySelect(cat._id)}
                className={`px-4 py-2 rounded-full font-semibold transition
                  ${selectedCategory === cat._id
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  }`}
              >
                {cat.name}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => handleCategorySelect("")}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                All
              </button>
            )}
          </motion.div>
        )}

        {/* Posts Grid */}
        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
        ) : posts.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gray-600 text-center py-20 text-lg"
          >
            No posts found in this category.
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-2xl shadow-md overflow-hidden p-4 cursor-pointer"
                onClick={() => navigate(`/reader/post/${post.slug}`)}
              >
                <div className="h-52 w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h2 className="text-lg font-semibold leading-snug line-clamp-1 mt-2">
                  {post.title}
                </h2>

                {post.category && (
                  <span className="inline-block bg-purple-100 w-fit text-purple-700 my-2 px-3 py-1 rounded-full font-medium text-xs">
                    {post.category.name}
                  </span>
                )}

                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.short_desc}
                </p>

                <div className="flex gap-3 items-center mt-2">
                  <img
                    src={post.author?.avatar || "/profile.jpg"}
                    alt={post.author?.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm">{post.author?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button className="mt-3 self-start text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline transition">
                  Read more →
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-14">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-5 py-2 bg-[#7c6ee6] hover:bg-[#6a5be2] text-white rounded-lg cursor-pointer transition disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2 font-semibold">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-5 py-2 bg-[#7c6ee6] text-white rounded-lg hover:bg-[#6a5be2] cursor-pointer transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
