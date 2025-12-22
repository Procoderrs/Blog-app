import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import Hero from "../components/Hero";

export default function Reader() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
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

  useEffect(() => {
    loadPosts(selectedCategory, page);
  }, [page, selectedCategory]);

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
    setShowDropdown(false);
    setPage(1);
  };


  const categoryImages = {
  Technology: "/category-images/tech.jpg",
  Travel: "/category-images/travel.jpg",
  Life: "/category-images/life.jpg",
  AI: "/category-images/ai.jpg",
  Business: "/category-images/business.jpg",
  // Add the rest of your categories here
};


  return (
    <>
      

      {/* Dynamic Hero */}
      <Hero featuredPost={posts[0]} />
<div className="px-12 bg-[#D8D5EA]">


      <div className=" px-6 ">

        {/* Featured Story (second post if exists) */}
        {posts.length > 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-20"
          >
            <h3 className="text-3xl font-semibold mb-8">Featured Story</h3>
            <div
              className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => navigate(`/reader/post/${posts[1].slug}`)}
            >
              <img
                src={posts[1].image}
                alt={posts[1].title}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-8">
                {posts[1].category && (
                  <span className="bg-purple-600 text-white px-3 py-1 w-fit rounded-full text-sm mb-3">
                    {posts[1].category.name}
                  </span>
                )}
                <h4 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                  {posts[1].title}
                </h4>
                <p className="text-purple-200 text-sm line-clamp-2 mb-2">
                  {posts[1].short_desc}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={posts[1].author?.avatar || "/profile.jpg"}
                    alt={posts[1].author?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-purple-200 text-sm">
                    {posts[1].author?.name}
                  </span>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Categories */}
        {/* Categories */}
{/* Categories Section */}
{!categoriesLoading && categories.length > 0 && (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="bg-[#D8D5EA] py-20"
  >
    <h3 className="text-3xl font-semibold mb-10">Explore Categories</h3>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((cat, index) => {
        // Fixed image array
        const categoryImages = [
          "/img-2.jpg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
          "/img-5.jpeg",
          "/img-3.jpg",
        ];

        const imageSrc = categoryImages[index % categoryImages.length]; // cycle if more categories than images

        return (
          <motion.div
            key={cat._id}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
            onClick={() => navigate(`/category/${cat._id}`)}
            className="relative h-28 rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={imageSrc}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-purple-600/30 opacity-0 group-hover:opacity-100 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h4 className="text-white text-xl font-semibold">{cat.name}</h4>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.section>
)}



        {/* Latest Blogs */}
        {/* Latest Blogs */}
<section className="py-12">
  <h3 className="text-3xl font-semibold mb-10">Latest on BlogStack</h3>

  {loading ? (
    <div className="w-full flex justify-center py-20">
      <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
    </div>
  ) : posts.length > 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
    >
      {posts.map((post) => (
        <motion.div
          key={post._id}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="group bg-[#F5f6fa] rounded-2xl shadow-md  overflow-hidden p-4 cursor-pointer"
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

          <p className="text-gray-600 text-sm line-clamp-1">
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
  ) : (
    // No posts in this category
    <div className="text-center py-20">
      <p className="text-gray-600 text-lg mb-6">
        No posts found in this category.
      </p>
      {user ? (
        <button
          onClick={() => navigate("/dashboard/add-post")}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Be the first to create a post
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Login to create a post
        </button>
      )}
    </div>
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
</section>

      </div>
      </div>
    </>
  );
}
