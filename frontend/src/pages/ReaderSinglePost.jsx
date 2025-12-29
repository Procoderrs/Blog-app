// src/pages/ReaderSinglePost.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import PublicHeader from "../components/PublicHeader";
import BlogHero from "../components/BlogHero";
import RelatedPosts from "../components/RelatedPosts";

export default function ReaderSinglePost() {
  const { slug } = useParams();
  console.log("SLUG FROM URL:", slug);

  // State for storing the post
  const [post, setPost] = useState(null);

  /**
   * Fetch single public post by slug on component mount
   */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/posts/public/slug/${slug}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching public post:", err.response?.data || err.message);
      }
    };

    load();
  }, [slug]);

  // Show loading indicator while post is being fetched
  if (!post) return <p>Loading...</p>;

  return (
    <>
     <div className="flex lg:flex-row gap-12 mx-4 flex-col">


    
      {/* Main post container */}
      <div className="p-6 max-w-3xl  bg-purple-50 rounded-lg shadow-sm">

        {/* Author info */}
        <div className="text-gray-600 text-sm mb-4">
          Written by <span className="font-semibold text-xl">{post.author.name}</span>
        </div>

        {/* Cover Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="h-80 object-cover w-full rounded"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold mt-4">{post.title}</h1>

        {/* Short description */}
        <p className="text-gray-600 mt-2">{post.short_desc}</p>

        {/* Blog content */}
        <div
          className="mt-6 blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4">
        <RelatedPosts/>
 </div>
      </div>
    </>
  );
}
