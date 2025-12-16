// src/pages/FullPost.jsx
import React, { useEffect, useState,useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import Header from "../components/Header";

export default function FullPost() {
  console.log('ful-post-page-render');
  const {user}=useContext(AuthContext)
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/slug/${slug}`, {
  headers: { Authorization: `Bearer ${user.token}` }
}); // make sure backend supports get single post
        setPost(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchPost();
  }, [slug]);

  if (!post) return <p>Loading...</p>;

  return (
    <>
    <Header/>
    <div className="max-w-4xl w-full  mx-auto mt-10 bg-purple-50 p-8 rounded-lg shadow">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-80 object-cover rounded mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-4">{post.short_desc}</p>
      <div
        className="prose  wrap-break-word"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back
      </button>
    </div>
  </>
  );
}
