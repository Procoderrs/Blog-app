// ===============================
// React & Hooks
// ===============================
import React, { useContext, useEffect, useState } from "react";

// ===============================
// Routing
// ===============================
import { useParams, useNavigate } from "react-router-dom";

// ===============================
// API & Animation
// ===============================
import api from "../api/api";
import { motion } from "framer-motion";

// ===============================
// UI Components
// ===============================
import PublicHeader from "../components/PublicHeader";
import { AuthContext } from "../context/AuthContext";

export default function CategoryPage() {
	// ===============================
	// Route Params
	// ===============================
	const { categoryId } = useParams();

	// ===============================
	// State Management
	// ===============================
	const [posts, setPosts] = useState([]);
	const [categoryName, setCategoryName] = useState("");
	const [loading, setLoading] = useState(true);

	// ===============================
	// context
	// ===============================
	const navigate = useNavigate();
	const {user,loading:authLoading}=useContext(AuthContext)

	// Pagination
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);


	// ===============================
	// Fetch Posts on Category/Page Change
	// ===============================
	useEffect(() => {
		fetchCategoryPosts(categoryId, page);
	}, [categoryId, page]);

	// ===============================
	// Fetch Category Posts
	// ===============================
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

			// Derive category name from first post
			if (fetchedPosts.length > 0) {
				setCategoryName(
					fetchedPosts[0].category?.name || "Unknown Category"
				);
			}
		} catch (err) {
			console.error(err.response?.data || err.message);
			setPosts([]);
			setCategoryName("Unknown Category");
		} finally {
			setLoading(false);
		}
	};
if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
    </div>
  );
}
	return (

		
		<div className="min-h-screen bg-gray-50">
			{/* ===============================
				Public Header
			================================ */}
			{/* <PublicHeader /> */}

			<div className="max-w-6xl mx-auto px-6">
				{/* ===============================
					Category Header Section
				================================ */}
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
							{posts.length} article
							{posts.length > 1 ? "s" : ""} publisheddd
						</p>
					</motion.section>
				)}

				{/* ===============================
					Posts Grid
				================================ */}
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
								onClick={() =>
									navigate(`/reader/post/${post.slug}`)
								}
								className="
									group
									bg-white
									rounded-2xl
									shadow-md
									overflow-hidden
									p-4
									cursor-pointer
								"
							>
								{/* Post Image */}
								<div className="h-52 w-full overflow-hidden">
									<img
										src={post.image}
										alt={post.title}
										className="
											h-full
											w-full
											object-cover
											transition-transform
											duration-300
											group-hover:scale-105
										"
									/>
								</div>

								{/* Post Title */}
								<h2 className="text-lg font-semibold mt-3 line-clamp-1">
									{post.title}
								</h2>

								{/* Short Description */}
								<p className="text-gray-600 text-sm line-clamp-2">
									{post.short_desc}
								</p>

								{/* Author Info */}
								<div className="flex items-center gap-3 mt-3">
									<img
										src={
											post.author?.avatar ||
											"/profile.jpg"
										}
										alt={post.author?.name}
										className="w-10 h-10 rounded-full object-cover"
									/>
									<div>
										<p className="font-semibold text-sm">
											{post.author?.name}
										</p>
										<p className="text-xs text-gray-500">
											{new Date(
												post.createdAt
											).toLocaleDateString()}
										</p>
									</div>
								</div>

								{/* Read More */}
								<button
									className="
										mt-3
										text-sm
										font-medium
										text-purple-600
										hover:text-purple-800
										hover:underline
										transition
									"
								>
									Read more →
								</button>
							</motion.div>
						))}
					</motion.div>
				)}

				{/* ===============================
					Empty State
				================================ */}
				{!loading && posts.length === 0 && (
					<div className="text-center py-20">
						<p className="text-gray-600 text-lg mb-6">
							No posts found in this category.
						</p>

						<button
  onClick={() => {
    if (user) {
      navigate("/dashboard/add-post");
    } else {
      navigate("/login");
    }
  }}
  className="bg-purple-900 hover:bg-purple-800 text-white px-6 py-3 rounded-lg transition"
>
  {user ? "Be the First to Create a Post" : "Login to Create a Post"}
</button>

					</div>
				)}

				{/* ===============================
					Pagination
				================================ */}
				{/* {!loading && posts.length > 0 && (
					<div className="flex items-center justify-center gap-4 mt-10 pb-16">
						<button
							disabled={page === 1}
							onClick={() => setPage((prev) => prev - 1)}
							className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 transition"
						>
							Prev
						</button>

						<span className="font-semibold">
							Page {page} of {totalPages}
						</span>

						<button
							disabled={page === totalPages}
							onClick={() => setPage((prev) => prev + 1)}
							className="px-5 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 transition"
						>
							Next
						</button>
					</div>
				)} */}
			</div>
		</div>
	);
}
