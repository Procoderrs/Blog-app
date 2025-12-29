import React from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturedStory({ post }) {
	const navigate = useNavigate();

	// If no post is provided, don't render anything
	if (!post) return null;

	return (
		<div className="max-w-6xl mx-auto px-6 mb-16">
			{/* ===============================
				Featured Story Card
			================================ */}
			<div
				onClick={() => navigate(`/reader/post/${post.slug}`)}
				className="
					group
					cursor-pointer
					h-64
					bg-[#F5F2F2]
					rounded-3xl
					shadow-lg
					overflow-hidden
					grid
					md:grid-cols-2
					gap-6
				"
			>
				{/* ===============================
					Image Section
				================================ */}
				<div className="overflow-hidden">
					<img
						src={post.image}
						alt={post.title}
						className="
							h-full
							w-full
							object-cover
							group-hover:scale-105
							transition-transform
							duration-500
						"
					/>
				</div>

				{/* ===============================
					Content Section
				================================ */}
				<div className="p-8 flex flex-col justify-center">
					{/* Featured Label */}
					<span className="inline-block mb-3 bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold">
						Featured Story
					</span>

					{/* Title */}
					<h2 className="text-3xl font-bold line-clamp-1 leading-tight mb-4 text-gray-900">
						{post.title}
					</h2>

					{/* Short Description */}
					<p className="text-gray-600 text-lg mb-6 line-clamp-3">
						{post.short_desc}
					</p>

					{/* Author Info */}
					<div className="flex items-center gap-4">
						<img
							src={post.author?.avatar || "/profile.jpg"}
							alt={post.author?.name}
							className="w-12 h-12 rounded-full object-cover"
						/>
						<div>
							<p className="font-semibold">{post.author?.name}</p>
							<p className="text-sm text-gray-500">
								{new Date(post.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>

					{/* Read More Link */}
					<span className="mt-6 text-purple-600 font-semibold">
						Read featured →
					</span>
				</div>
			</div>
		</div>
	);
}
