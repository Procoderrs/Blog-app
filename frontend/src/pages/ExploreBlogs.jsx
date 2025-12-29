// ===============================
// React & Hooks
// ===============================
import React, { useContext, useEffect, useState } from "react";

// ===============================
// Routing & API
// ===============================
import { useNavigate } from "react-router-dom";
import api from "../api/api";

// ===============================
// Animation
// ===============================
import { motion } from "framer-motion";

// ===============================
// Context
// ===============================
import { AuthContext } from "../context/AuthContext";

// ===============================
// Components
// ===============================
import PublicHeader from "../components/PublicHeader";
import Hero from "../components/Hero";
import FeaturedStory from "../components/FeatureStory";
import CategoryPage from "./CategoryPage";
import BlogHero from "../components/BlogHero";

export default function ExploreBlogs() {
	// ===============================
	// State
	// ===============================
	const [posts, setPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [loading, setLoading] = useState(true);
	const [categoriesLoading, setCategoriesLoading] = useState(true);

	const [featuredPost, setFeaturedPost] = useState(null);

	// Pagination
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	// ===============================
	// Load Categories & Featured Post on Mount
	// ===============================
	useEffect(() => {
		loadCategories();
		/* loadFeaturedPost(); */
	}, []);

	// Fetch featured post
	/* const loadFeaturedPost = async () => {
		try {
			const res = await api.get("/posts/public?limit=1");
			setFeaturedPost(res.data.posts?.[0] || null);
		} catch (err) {
			console.log("Featured post error:", err.message);
		}
	}; */

	// ===============================
	// Load posts when category or page changes
	// ===============================
	useEffect(() => {
		loadPosts(selectedCategory, page);
	}, [selectedCategory, page]);

	// ===============================
	// Fetch Categories
	// ===============================
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

	// ===============================
	// Fetch Posts
	// ===============================
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
		<div className="min-h-screen bg-[#FCF8F8]">
			{/* ===============================
				blog Header
			================================ */}
			
<BlogHero/>

			{/* ===============================
				Featured Story
			================================ */}
			{/* <FeaturedStory post={featuredPost} /> */}

			<div className="max-w-6xl mx-auto px-6">
				{/* ===============================
					Category Filter
				================================ */}
				{!categoriesLoading && categories.length > 0 && (
					<motion.section
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="py-20"
					>
						<h3 className="text-3xl font-semibold mb-10">
							Explore Categories
						</h3>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							{categories.map((cat, index) => {
								// Fixed images cycling
								const categoryImages = [
									"/img-2.jpg",
									"/img-3.jpg",
									"/img-5.jpeg",
								];
								const imageSrc =
									categoryImages[index % categoryImages.length];

								return (
									<motion.div
										key={cat._id}
										whileHover={{ scale: 1.03 }}
										transition={{ duration: 0.3 }}
										onClick={() =>
											navigate(`/category/${cat._id}`)
										}
										className="relative h-28 rounded-xl overflow-hidden cursor-pointer group"
									>
										<img
											src={imageSrc}
											alt={cat.name}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-purple-600/30 opacity-0 group-hover:opacity-100 transition" />
										<div className="absolute inset-0 flex items-center justify-center">
											<h4 className="text-white text-xl font-semibold">
												{cat.name}
											</h4>
										</div>
									</motion.div>
								);
							})}
						</div>
					</motion.section>
				)}

				{/* ===============================
					Posts Grid
				================================ */}
				{loading ? (
					<div className="w-full flex justify-center py-20">
						<div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
					</div>
				) : posts.length === 0 ? (
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
						className="text-gray-600 text-center py-20 text-lg"
					>
						No posts found in this category.
					</motion.p>
				) : (
					<section className=" pb-20">
						<h3 className="text-3xl font-semibold mb-10">
							view All  Posts
						</h3>

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
  className="group flex flex-col bg-[#F5f6fa] rounded-2xl shadow-md overflow-hidden p-4 cursor-pointer"
  onClick={() => navigate(`/reader/post/${post.slug}`)}
>
  {/* Post Image */}
  <div className="w-full rounded overflow-hidden">
    <img
      src={post.image}
      alt={post.title}
      className=" w-full  object-cover transition-transform duration-300 group-hover:scale-105"
    />
  </div>

  {/* Post Content */}
  <div className=" ">
    <div className="flex mt-2 flex-col gap-y-2 ">
			{/* Category Tag */}
      
      {post.category && (
        <span className="inline-block bg-purple-100 w-fit text-purple-700 px-3 py-1 rounded-full font-medium text-xs">
          {post.category.name}
        </span>
      )}
      {/* Post Title */}
      <h2 className="text-lg font-semibold leading-snug  font-serif ">
        {post.title}
      </h2>

      
     

      {/* Short Description */}
      {/* <p className="text-gray-600 text-sm line-clamp-1">
        {post.short_desc}
      </p> */}

      {/* Author Info */}
      <div className="flex items-center justify-between gap-3 ">
        <img
          src={post.author?.avatar || "/profile.jpg"}
          alt={post.author?.name}
          className="w-10 h-10 object-cover rounded-full"
        />

       
          <p className="font-semibold text-[#3B3363] ">
            {post.author?.name}
          </p>
          <p className=" text-[#3B3363]">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        
      </div>
    </div>

    {/* Read More Button */}
    {/*
    <button className="mt-3 self-start text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline transition">
      Read more →
    </button>
    */}
  </div>
</motion.div>

							))}
							
						</motion.div>

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
				)}
			</div>
		</div>
	);
}
