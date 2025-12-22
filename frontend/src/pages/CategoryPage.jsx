import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { motion } from "framer-motion";
import Hero from "../components/Hero";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoryPosts(categoryId, page);
  }, [categoryId, page]);

  const fetchCategoryPosts = async (catId, pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/posts/public?category=${catId}&page=${pageNumber}&limit=6`
      );

      const fetchedPosts = res.data.posts || [];
      setPosts(fetchedPosts);
      setPage(res.data.currentPage || 1);
      setTotalPages(res.data.totalPages || 1);

      if (fetchedPosts.length > 0) {
        setCategoryName(fetchedPosts[0].category?.name || "Unknown Category");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setPosts([]);
      setCategoryName("Unknown Category");
    } finally {
      setLoading(false);
    }
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero = Featured Post */}
      {!loading && featuredPost && <Hero featuredPost={featuredPost} />}

      <div className="max-w-6xl mx-auto px-6">

        {/* Featured Category Info */}
        {!loading && posts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-12 text-center"
          >
            <h1 className="text-4xl font-bold text-purple-700 mb-3">
              {categoryName}
            </h1>
            <p className="text-gray-600 text-lg">
              {posts.length} article{posts.length > 1 ? "s" : ""} published
            </p>
          </motion.section>
        )}

        {/* Posts Grid (includes featured post as well) */}
        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pb-20"
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

                <h2 className="text-lg font-semibold mt-2 line-clamp-1">
                  {post.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {post.short_desc}
                </p>

                <div className="flex gap-3 items-center mt-3">
                  <img
                    src={post.author?.avatar || "/profile.jpg"}
                    alt={post.author?.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {post.author?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline transition">
                  Read more →
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-6">
              No posts found in this category.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Login to create a post
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && posts.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-10 pb-16">
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
        )}
      </div>
    </div>
  );
}
