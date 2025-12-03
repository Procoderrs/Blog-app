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
	console.log(user);
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
			const res = await api.get("/admin/categories", {
				headers: { Authorization: `Bearer ${user?.token}` },
			});
			setCategories(res.data.cats || []);
		} catch (err) {
			console.log("Fetch categories error:", err.response?.data || err.message);
		}
	};

	const fetchPosts = async (categoryId = "") => {
		try {
			const url = categoryId ? `/posts?category=${categoryId}` : "/posts";
			const res = await api.get(url, {
				headers: { Authorization: `Bearer ${user?.token}` },
			});
			setBlogs(Array.isArray(res.data) ? res.data : []);
			console.log(res.data)
		} catch (err) {
			console.log("Fetch posts error:", err.response?.data || err.message);
		}
	};

	const handleCategorySelect = (catId) => {
		setSelectedCategory(catId);
		setShowDropdown(false);
		fetchPosts(catId);
	};

	const handleDelete = async (postId) => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;

		try {
			await api.delete(`/posts/delete/${postId}`, {
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
		<div className="min-h-screen bg-gray-100 p-6">
			<Header />

			{/* -------- Show User Dashboard ONLY if not admin -------- */}
			{user?.role !== "admin" && (
				<>
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

						{showDropdown && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className="absolute mt-1 w-full bg-white shadow rounded z-50"
							>
								<button
									onClick={() => handleCategorySelect("")}
									className={`block w-full text-left px-4 py-2 hover:bg-purple-100 ${
										selectedCategory === "" ? "font-bold text-purple-700" : ""
									}`}
								>
									All
								</button>
								{categories.map((cat) => (
									<button
										key={cat._id}
										onClick={() => handleCategorySelect(cat._id)}
										className={`block w-full text-left px-4 py-2 hover:bg-purple-100 ${
											selectedCategory === cat._id
												? "font-bold text-purple-700"
												: ""
										}`}
									>
										{cat.name}
									</button>
								))}
							</motion.div>
						)}
					</div>

					{/* Posts Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 auto-rows-min">
						<AnimatePresence mode="popLayout">
							{blogs.length > 0 ? (
								blogs.map((post) => (
									<motion.div
										key={post._id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -20 }}
										transition={{ duration: 0.3 }}
										className="backdrop-blur-md bg-[#f9f5ff] rounded-xl shadow-lg overflow-hidden flex flex-col"
									>
										<img
											src={post.image}
											alt={post.title}
											className="h-64 p-3 rounded-2xl w-full object-cover"
										/>

										<div className="p-4 flex flex-col flex-1">
											<div className="flex gap-2 items-start justify-between">
												<h2 className="text-xl font-bold mb-2 line-clamp-1">
													{post.title}
												</h2>
												<button
													onClick={() => navigate(`/post/${post._id}`)}
													className="text-blue-600 hover:underline text-sm flex items-center"
												>
													<i className="ri-arrow-right-up-long-line text-lg font-black text-purple-900"></i>
												</button>
											</div>

											{post.category && (
												<span className="inline-block bg-purple-200 text-purple-900 px-3 py-1 rounded-full font-semibold mb-2 text-sm animate-pulse">
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
															navigate("/update-post", { state: { post } })
														}
														className="bg-[#33006F] text-white px-3 py-1 rounded hover:bg-purple-500"
													>
														Update
													</button>
												)}

												{(user.role === "admin" ||
													post.author._id === user._id) && (
													<button
														onClick={() => handleDelete(post._id)}
														className="bg-[#452c63] text-white px-3 py-1 rounded hover:bg-purple-400"
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
				</>
			)}
		</div>
	);
};

export default Dashboard;
