import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import { motion, AnimatePresence } from "framer-motion";

export default function UserPosts() {
  const { id } = useParams(); 
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [authorName, setAuthorName] = useState(""); 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  
  // Load posts
  const loadPosts = async () => {
  try {
    const res = await api.get(
      `/admin/users/${id}/posts${selectedCategory ? `?category=${selectedCategory}` : ""}`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    );

    const data = res.data.map((post) => ({
      ...post,
      category: post.category ? post.category : { name: "No Category", _id: null },
      slug:post.slug
    }));

    setPosts(data);
    setAllPosts(data);

    setAuthorName(data.length > 0 ? data[0].author?.name || "User" : "User");
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
};
useEffect(() => {
  if (!id) return;
  loadCategories();
  loadPosts();
}, [id]);

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

  // Filter posts by category
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setShowDropdown(false);

    if (!catId) setPosts(allPosts);
    else setPosts(allPosts.filter(p => p.category?._id === catId));
  };

  // Delete post
  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/admin/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const updated = posts.filter(p => p._id !== postId);
      setPosts(updated);
      setAllPosts(updated);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
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
                      className="w-full h-56 md:h-48 lg:h-52 rounded-xl object-cover mb-3"
                    />
                  )}

                  <h2 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
                    {p.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-2">
  Slug: <span className="font-mono">{p.slug}</span>
</p>

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
                      className="flex-1 bg-purple-500 text-white py-2 rounded-lg text-sm hover:bg-purple-600 transition"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deletePost(p._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>

                    <button
  onClick={() => navigate(`/admin/post/${p.slug}`, { state: { post: p } })}
  className="flex-1 bg-purple-700 text-white py-2 px-1 rounded-lg text-sm hover:bg-purple-800 transition"
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
      </div>
    </div>
  );
}
