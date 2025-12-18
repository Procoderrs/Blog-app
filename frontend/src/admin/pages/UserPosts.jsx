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

  // Fetch categories
  const loadCategories = async () => {
    try {
      const res = await api.get("/categories", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // Fetch posts
  const loadPosts = async () => {
    try {
      const res = await api.get(
        `/admin/users/${id}/posts?page=${page}&limit=${limit}${
          selectedCategory ? `&category=${selectedCategory}` : ""
        }`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setPosts(res.data.posts || []);
      setTotalPages(res.data.totalPages || 1);

      if (res.data.posts?.length) {
        setAuthorName(res.data.posts[0].author?.name || "User");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (id) loadCategories();
  }, [id]);

  useEffect(() => {
    if (id) loadPosts();
  }, [id, page, selectedCategory]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setShowDropdown(false);
    setPage(1);
  };

  const deletePost = async (slug) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/admin/${slug}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      loadPosts();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-[#3B3363] mb-4">
          {authorName}'s Posts
        </h1>

        {/* Category Dropdown */}
        <div className="relative w-64 mb-6">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white px-4 py-2.5 rounded-lg shadow-sm flex justify-between items-center transition"
          >
            {selectedCategory
              ? categories.find((c) => c._id === selectedCategory)?.name
              : "Select Category"}
            <span className="text-sm">&#9662;</span>
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-xl z-50"
              >
                <button
                  onClick={() => handleCategorySelect("")}
                  className="block w-full text-left px-4 py-2.5 text-sm text-[#3B3363] hover:bg-[#F0EEFF]"
                >
                  All Categories
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat._id)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-[#3B3363] hover:bg-[#F0EEFF]"
                  >
                    {cat.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {posts.length ? (
              posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-lg font-semibold text-[#3B3363] line-clamp-1">
                      {post.title}
                    </h2>

                    {post.category && (
                      <span className="inline-block bg-[#F0EEFF] text-[#3B3363] px-3 py-1 rounded-full text-xs font-medium w-fit mt-2">
                        {post.category.name}
                      </span>
                    )}

                    <p className="text-[#6B7280] text-sm mt-2 line-clamp-2">
                      {post.short_desc}
                    </p>

                    <p className="text-xs text-[#6D7280] mt-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-auto flex gap-2 pt-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/update-post/${post.slug}`, {
                            state: { userId: id },
                          })
                        }
                        className="flex-1 bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white py-2 rounded-lg text-sm transition"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => deletePost(post.slug)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm transition"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          navigate(`/admin/post/${post.slug}`, {
                            state: { post },
                          })
                        }
                        className="flex-1 bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white py-2 rounded-lg text-sm transition"
                      >
                        Full Blog
                      </button>
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
                No posts found.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white rounded-lg disabled:opacity-50 transition"
            >
              Prev
            </button>

            <span className="px-4 py-2 font-medium text-[#3B3363]">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white rounded-lg disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
