import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import { motion, AnimatePresence } from "framer-motion";

export default function UserPosts() {
  const { id } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState(""); 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Load categories
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(res.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Load posts with pagination and category filter
  const loadPosts = async () => {
    try {
      const res = await api.get(
        `/admin/users/${id}/posts?page=${page}&limit=${limit}${selectedCategory ? `&category=${selectedCategory}` : ""}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = Array.isArray(res.data.posts) ? res.data.posts : res.data; // support both array or object with posts
      setPosts(data);

      // Pagination info from backend
      if (res.data.totalPages) setTotalPages(res.data.totalPages);
      if (res.data.posts && res.data.posts.length > 0) {
        setAuthorName(res.data.posts[0].author?.name || "User");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!id) return;
    loadCategories();
  }, [id]);

  useEffect(() => {
    loadPosts();
  }, [id, page, selectedCategory]);

  // Filter by category
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setShowDropdown(false);
    setPage(1); // reset to first page when category changes
  };

  // Delete post
  const deletePost = async (slug) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/admin/${slug}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      loadPosts(); // reload after deletion
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {authorName}'s Posts
        </h1>

        {/* Category Dropdown */}
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
                transition={{ duration: 0.2 }}
                className="absolute mt-1 w-full bg-white shadow rounded z-50"
              >
                <motion.button
                  onClick={() => handleCategorySelect("")}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                  whileHover={{ scale: 1.02, backgroundColor: "#f3e8ff" }}
                  whileTap={{ scale: 0.98 }}
                >
                  All
                </motion.button>

                {categories.map((cat) => (
                  <motion.button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat._id)}
                    className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                    whileHover={{ scale: 1.02, backgroundColor: "#f3e8ff" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <AnimatePresence mode="popLayout">
            {posts.length > 0 ? (
              posts.map((p) => (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col"
                >
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-64 p-3 rounded-xl object-cover mb-3"
                    />
                  )}

                  <h2 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
                    {p.title}
                  </h2>

                  <p className="text-purple-700 bg-purple-200 px-2 rounded font-medium text-sm mb-1">
                    {p.category?.name}
                  </p>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {p.short_desc}
                  </p>

                  <p className="text-xs text-gray-500 mb-4">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/update-post/${p.slug}`, { state: { userId:id } })
                      }
                      className="flex-1 bg-purple-500 cursor-pointer text-white py-2 rounded-lg text-sm hover:bg-purple-600 transition"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deletePost(p._id)}
                      className="flex-1 bg-red-500 cursor-pointer text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => navigate(`/admin/post/${p.slug}`, { state: { post: p } })}
                      className="flex-1 bg-purple-700 cursor-pointer text-white py-2 px-1 rounded-lg text-sm hover:bg-purple-800 transition"
                    >
                      Full Blog
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-600 mt-4 text-lg col-span-full"
              >
                No posts found.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2 font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
