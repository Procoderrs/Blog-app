// ===============================
// React & Core Hooks
// ===============================
import React, { useContext, useEffect, useState } from "react";

// ===============================
// Routing & API
// ===============================
import { useNavigate } from "react-router-dom";
import api from "../api/api";

// ===============================
// Context
// ===============================
import { AuthContext } from "../context/AuthContext";

// ===============================
// UI Components
// ===============================
import Hero from "../components/Hero";

// ===============================
// Animation
// ===============================
import { motion } from "framer-motion";
import Footer from "../components/Footer";

export default function Reader() {
  // ===============================
  // State
  // ===============================
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ===============================
  // Load Posts
  // ===============================
  useEffect(() => {
    loadPosts(page);
  }, [page]);

  const loadPosts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/posts/public?page=${pageNumber}&limit=3`
      );
      setPosts(res.data.posts || []);
      setPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Posts error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===============================
          Hero
      ================================ */}
      <Hero />

      {/* ===============================
          Header Row
      ================================ */}
      <div className="py-20">


      
      <div className="flex items-center justify-between md:px-12 px-4  mb-6">
        <div>
          <h2 className="md:text-3xl  text-xl font-semibold text-[#3B3363]">
            Recent Posts
          </h2>
          <div className="h-1 w-12 bg-purple-600 rounded-full mt-2" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/readerss")}
          className="
            px-4 py-2
            rounded-xl
            text-[#6B4E9B]
            font-semibold
            bg-[#E8E2F3]
            border border-[#C5B3E6]
            hover:bg-[#DDD3F0]
            transition
          "
        >
          View All Posts
        </motion.button>
      </div>

      {/* ===============================
          Posts Section
      ================================ */}
      {loading ? (
        <div className="flex justify-center ">
          <div className="animate-spin h-10 w-10 border-4 border-purple-700 border-t-transparent rounded-full" />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-600  text-lg">
          No posts found
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid
    grid-cols-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 px-4 md:px-12 gap-8 "
        >
          {posts.map((post) => (
            <motion.div
              key={post._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/reader/post/${post.slug}`)}
              className="
                group flex gap-4 bg-[#F5F6FA] rounded-2xl shadow-md  cursor-pointer
              "
            >
              {/* Image */}
              <div className="w-1/2 rounded-l-lg shadow-2xs overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="
                    h-44 w-full object-cover
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                />
              </div>

              {/* Content */}
              <div className="w-1/2 flex flex-col p-2 ">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-2 mt-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {post.short_desc}
                  </p>
                </div>

                {/* Author (Pinned Bottom) */}
                <div className="flex items-center gap-3 mt-auto pt-4">
                  <img
                    src={post.author?.avatar || "/profile.jpg"}
                    alt={post.author?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {post.author?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
</div>
      {/* ===============================
          Pagination
      ================================ */}
     {/*  {!loading && posts.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-14">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )} */}

      
    </>
  );
}
