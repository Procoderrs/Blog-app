// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories on mount
  useEffect(() => {
    if (user?.role !== "admin") fetchCategories();
  }, [user]);

  // Fetch posts whenever category or page changes
  useEffect(() => {
    if (user?.role !== "admin") fetchPosts(selectedCategory, page);
  }, [selectedCategory, page, user]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setCategories(res.data || []);
    } catch (err) {
      console.log("Fetch categories error:", err.response?.data || err.message);
    }
  };

  const fetchPosts = async (categoryId = "", pageNumber = 1) => {
    setLoading(true);
    setError("");
    try {
      let url = `/posts?page=${pageNumber}&limit=6`;
      if (categoryId) url += `&category=${categoryId}`;

      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setBlogs(res.data.posts || []);
      setPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.log("Fetch posts error:", err.response?.data || err.message);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setShowDropdown(false);
    setPage(1); // reset to first page
  };

  const handleDelete = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/delete/slug/${slug}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      alert("Post deleted successfully!");
      fetchPosts(selectedCategory, page);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E2E2]">
      <Header />

      {user?.role !== "admin" && (
        <div className="max-w-6xl mx-auto p-6">
          {/* Category Filter */}
          <div className="relative mb-6 w-64">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full bg-purple-600 cursor-pointer text-white px-4 py-2 rounded shadow flex justify-between items-center"
            >
              {selectedCategory
                ? categories.find((c) => c._id === selectedCategory)?.name
                : "Select Category"}
              <span className="ml-2">&#9662;</span>
            </button>

            {showDropdown && (
              <ul className="absolute bg-white shadow-md mt-1 w-full rounded z-50">
                <li
                  className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                  onClick={() => handleCategorySelect("")}
                >
                  All Categories
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                    onClick={() => handleCategorySelect(cat._id)}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Posts Grid */}
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading posts...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-10">{error}</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                <AnimatePresence mode="popLayout">
                  {blogs.length > 0 ? (
                    blogs.map((post) => (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="backdrop-blur-md bg-white rounded-xl shadow-lg overflow-hidden flex flex-col max-w-sm w-full"
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="max-h-48 h-full rounded-2xl w-full object-cover"
                        />

                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex gap-2 items-center justify-between">
                            <h2 className="text-xl font-bold mb-2 line-clamp-1">
                              {post.title}
                            </h2>
                            <button
                              onClick={() =>
                                navigate(`/dashboard/post/${post.slug}`)
                              }
                              className="text-blue-600 hover:underline cursor-pointer text-sm"
                            >
                              <i class="ri-arrow-right-up-line text-purple-800 text-lg"></i>
                            </button>
                          </div>

                          {post.category && (
                            <span className="inline-block bg-purple-200 text-purple-900 px-3 py-1 rounded-full font-semibold mb-2 text-sm">
                              {post.category.name}
                            </span>
                          )}

                          <p className="text-gray-700 mb-2 line-clamp-2">
                            {post.short_desc}
                          </p>

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

                          {(user.role === "admin" || post.author._id === user._id) && (
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() =>
                                  navigate(`/dashboard/update-post/${post.slug}`)
                                }
                                className="bg-purple-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-purple-500"
                              >
                                Update
                              </button>

                              <button
                                onClick={() => handleDelete(post.slug)}
                                className="bg-red-600 text-white cursor-pointer  px-3 py-1 rounded hover:bg-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          )}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  <span className="px-4 py-2 font-semibold">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
