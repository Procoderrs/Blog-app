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

	// Redirect admin to admin layout
	useEffect(() => {
		if (user?.role === "admin") {
			navigate("/admin");
		} else if (user?.role !== "admin") {
			fetchCategories();
			fetchPosts();
		}
	}, [user, navigate]);

	const fetchCategories = async () => {
		try {
			const res = await api.get("/categories", {
				headers: { Authorization: `Bearer ${user?.token}` },
			});
			console.log(res.data); // check the structure
			setCategories(res.data || []); // or res.data if API returns array
		} catch (err) {
			console.log("Fetch categories error:", err.response?.data || err.message);
		}
	};

	const fetchPosts = async (categoryId = "") => {
		setLoading(true);
		setError("");
		try {
			const url = categoryId ? `/posts?category=${categoryId}` : "/posts";
			const res = await api.get(url, {
				headers: { Authorization: `Bearer ${user?.token}` },
			});
			setBlogs(Array.isArray(res.data) ? res.data : []);
		} catch (err) {
			console.log("Fetch posts error:", err.response?.data || err.message);
			setError("Failed to fetch posts");
		}
		setLoading(false);
	};

	const handleCategorySelect = (catId) => {
		setSelectedCategory(catId);
		setShowDropdown(false);
		fetchPosts(catId);
	};

	const handleDelete = async (slug) => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		try {
			await api.delete(`/posts/delete/slug/${slug}`, {
				headers: { Authorization: `Bearer ${user?.token}` },
			});
			alert("Post deleted successfully!");
			fetchPosts(selectedCategory);
		} catch (err) {
			console.error(err.response?.data || err.message);
			alert("Failed to delete post");
		}
	};

	return (
		<div className="min-h-screen bg-[#E8E2E2] ">
			<Header />

			{user?.role !== "admin" && (
				<>
					{/* Category Filter */}
					<div className="relative mb-6 w-64">
						<button
							className="px-4 cursor-pointer py-2 bg-[#603F83] text-[#C7D3D4] rounded"
							onClick={() => setShowDropdown(!showDropdown)}
						>
							{selectedCategory
								? categories.find((c) => c._id === selectedCategory)?.name
								: "Select Category"}
						</button>

						{showDropdown && (
							<ul className="absolute bg-[#C7D3e4] shadow-md mt-1 w-38 rounded z-10">
								<li
									key="all"
									className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
									onClick={() => handleCategorySelect("")}
								>
									All Categories
								</li>
								{categories.map((cat) => (
									<li
										key={cat._id}
										className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
											className="backdrop-blur-md border border-[#A59D84] rounded-xl shadow-lg overflow-hidden flex flex-col max-w-sm max-h-[500px] w-full"
										>
											<img
												src={post.image}
												alt={post.title}
												className="max-h-48 h-full rounded-2xl w-full object-cover"
											/>

											<div className="px-4  py-1 pb-2 flex flex-col flex-1">
												<div className="flex gap-2 items-center justify-between">
													<h2 className="text-xl font-bold mb-2 line-clamp-1">
														{post.title}
													</h2>
													<button
														onClick={() => navigate(`/dashboard/post/${post.slug}`)}
														className=" bg-[#603F83] w-5 h-5 p-1 flex items-center justify-center rounded-full cursor-pointer  hover:underline text-sm "
													>
														<i className="ri-arrow-right-up-long-line font-black text-[#C7D3D4]"></i>
													</button>
												</div>

												{post.category && (
													<span className="inline-block bg-[#D7D3BF] text-purple-900 px-3 py-1 rounded-full font-semibold mb-2 text-sm animate-pulse">
														{post.category.name}
													</span>
												)}

												<p className="text-gray-700 mb-2 line-clamp-1">
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

												<div className="flex gap-2 mt-4">
													{(user.role === "admin" ||
														post.author._id === user._id) && (
														<button
															onClick={() =>
																navigate(`/dashboard/update-post/${post.slug}`)
															}
															className="border border-[#603F83] cursor-pointer bg-[#D7D3BF] text-[#727D73] px-3 py-1 rounded hover:bg-white transition-colors"
														>
															Update
														</button>
													)}

													{(user.role === "admin" ||
														post.author._id === user._id) && (
														<button
															onClick={() => handleDelete(post.slug)}
															  className="border border-[#603F83] bg-white text-[#727D73] px-3 py-1 cursor-pointer rounded hover:bg-[#D7D3BF] transition-colors"

														>
															Delete
														</button>
													)}
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
										No posts found in this category.
									</motion.p>
								)}
							</AnimatePresence>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Dashboard;
