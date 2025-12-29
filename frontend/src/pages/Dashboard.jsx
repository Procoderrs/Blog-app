// ===============================
// React & Core Hooks
// ===============================
import React, { useContext, useEffect, useState } from "react";

// ===============================
// Context & Routing
// ===============================
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ===============================
// API & Animation
// ===============================
import api from "../api/api";
import { motion, AnimatePresence } from "framer-motion";

// ===============================
// Layout Components
// ===============================
import Header from "../components/Header";

const Dashboard = () => {
	// ===============================
	// Context & Navigation
	// ===============================
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	// ===============================
	// State Management
	// ===============================
	const [categories, setCategories] = useState([]);
	const [blogs, setBlogs] = useState([]);

	const [selectedCategory, setSelectedCategory] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	// Pagination
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// ===============================
	// Fetch Categories on Mount
	// ===============================
	useEffect(() => {
		if (user?.role !== "admin") {
			fetchCategories();
		}
	}, [user]);

	// ===============================
	// Fetch Posts on Category/Page Change
	// ===============================
	useEffect(() => {
		if (user?.role !== "admin") {
			fetchPosts(selectedCategory, page);
		}
	}, [selectedCategory, page, user]);

	// ===============================
	// Fetch User Categories
	// ===============================
	const fetchCategories = async () => {
		try {
			const res = await api.get("/categories", {
				headers: {
					Authorization: `Bearer ${user?.token}`,
				},
			});
			setCategories(res.data || []);
			console.log(res.data);
		} catch (err) {
			console.error(
				"Fetch categories error:",
				err.response?.data || err.message
			);
		}
	};

	// ===============================
	// Fetch User Posts (with Pagination)
	// ===============================
	const fetchPosts = async (categoryId = "", pageNumber = 1) => {
		setLoading(true);
		setError("");

		try {
			let url = `/posts?page=${pageNumber}&limit=6`;
			if (categoryId) url += `&category=${categoryId}`;

			const res = await api.get(url, {
				headers: {
					Authorization: `Bearer ${user?.token}`,
				},
			});

			setBlogs(res.data.posts || []);
			setPage(res.data.currentPage || 1);
			setTotalPages(res.data.totalPages || 1);
			console.log(res.data);
		} catch (err) {
			console.error(
				"Fetch posts error:",
				err.response?.data || err.message
			);
			setError("Failed to fetch posts");
		} finally {
			setLoading(false);
		}
	};

	// ===============================
	// Handle Category Selection
	// ===============================
	const handleCategorySelect = (catId) => {
		setSelectedCategory(catId);
		setShowDropdown(false);
		setPage(1); // Reset pagination
	};

	// ===============================
	// Delete Post Handler
	// ===============================
	const handleDelete = async (slug) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this post?"
		);
		if (!confirmDelete) return;

		try {
			await api.delete(`/posts/delete/slug/${slug}`, {
				headers: {
					Authorization: `Bearer ${user?.token}`,
				},
			});

			alert("Post deleted successfully!");
			fetchPosts(selectedCategory, page);
		} catch (err) {
			console.error(err.response?.data || err.message);
			alert("Failed to delete post");
		}
	};

	return (
		<div className="min-h-screen bg-[#F5F6FA]">
			{/* ===============================
				Dashboard Header
			================================ */}
			<Header />

			{user?.role !== "admin" && (
				<div className="max-w-6xl mx-auto p-6">
					{/* ===============================
						Category Filter Dropdown
					================================ */}
					<div className="relative mb-6 w-64">
						<button
							onClick={() => setShowDropdown(!showDropdown)}
							className="
								w-full
								bg-[#7C6EE6]
								hover:bg-[#6A5BE2]
								text-white
								px-4
								py-2.5
								rounded-lg
								shadow-sm
								flex
								justify-between
								items-center
								transition
							"
						>
							{selectedCategory
								? categories.find(
										(c) => c._id === selectedCategory
								  )?.name
								: "Select Category"}
							<span className="text-sm">&#9662;</span>
						</button>

						{showDropdown && (
							<ul className="absolute bg-white shadow-md mt-1 w-full rounded-lg z-50">
								<li
									onClick={() => handleCategorySelect("")}
									className="px-4 py-2.5 hover:bg-[#F0EEFF] cursor-pointer text-sm transition"
								>
									All Categories
								</li>

								{categories.map((cat) => (
									<li
										key={cat._id}
										onClick={() =>
											handleCategorySelect(cat._id)
										}
										className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-sm"
									>
										{cat.name}
									</li>
								))}
							</ul>
						)}
					</div>

					{/* ===============================
						Posts Section
					================================ */}
					{loading ? (
						<p className="text-center font-semibold text-lg text-gray-500 mt-10">
							Loading posts...
						</p>
					) : error ? (
						<p className="text-center text-red-500 mt-10">
							{error}
						</p>
					) : (
						<>
							{/* Posts Grid */}
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								<AnimatePresence mode="popLayout">
									{blogs.length > 0 ? (
										blogs.map((post) => (
											<motion.div
												key={post._id}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -20 }}
												transition={{ duration: 0.3 }}
												className="
													bg-white
													rounded-2xl
													shadow-sm
													hover:shadow-md
													transition
													overflow-hidden
													flex
													flex-col
													cursor-pointer
												"
												onClick={() =>
									navigate(`/reader/post/${post.slug}`)
								}
											>
												{/* Post Image */}
												<img
													src={post.image}
													alt={post.title}
													className="h-48 w-full object-cover"
												/>

												{/* Post Content */}
												<div className="p-4 flex flex-col flex-1">
													<div className="flex justify-between items-center gap-2">
														<h2 className="text-lg font-semibold text-[#3B3363] line-clamp-1">
															{post.title} 
														</h2>

														<button
															onClick={() =>
																navigate(
																	`/dashboard/post/${post.slug}`
																)
															}
															className="text-purple-700 hover:text-purple-900 transition"
														>
															<i className="ri-arrow-right-up-line text-lg"></i>
														</button>
													</div>

													{/* Category Badge */}
													{post.category && (
														<span className="inline-block bg-[#F0EEFF] text-[#3B3363] px-3 py-1 rounded-full font-medium mb-2 text-xs">
															{
																post.category
																	.name
															}
														</span>
													)}

													{/* Description */}
													<p className="text-gray-500 text-sm mb-3 line-clamp-2">
														{post.short_desc}
													</p>

													{/* Author */}
													<div className="flex items-center gap-4 mt-auto">
														<img
															src="/profile.jpg"
															alt="Author"
															className="w-10 rounded-full"
														/>
														<div>
															<p className="font-medium text-sm text-[#3B3363]">
																{
																	post.author
																		?.name
																}
															</p>
															<p className="text-xs text-gray-500">
																{new Date(
																	post.createdAt
																).toLocaleDateString()}
															</p>
														</div>
													</div>

													{/* Actions */}
													{(user.role === "admin" ||
														post.author._id ===
															user._id) && (
														<div className="flex gap-2 mt-4">
															<button
																onClick={() =>
																	navigate(
																		`/dashboard/update-post/${post.slug}`
																	)
																}
																className="bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white px-3 py-1.5 rounded-lg text-sm transition"
															>
																Update
															</button>

															<button
																onClick={() =>
																	handleDelete(
																		post.slug
																	)
																}
																className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
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

							{/* ===============================
								Pagination
							================================ */}
							{totalPages > 1 && (
								<div className="flex justify-center gap-3 mt-8">
									<button
										disabled={page === 1}
										onClick={() =>
											setPage((prev) => prev - 1)
										}
										className="px-4 py-2 bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white rounded-lg disabled:opacity-50 transition"
									>
										Prev
									</button>

									<span className="px-4 py-2 font-medium text-[#3B3363]">
										Page {page} of {totalPages}
									</span>

									<button
										disabled={page === totalPages}
										onClick={() =>
											setPage((prev) => prev + 1)
										}
										className="px-4 py-2 bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white rounded-lg disabled:opacity-50 transition"
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
