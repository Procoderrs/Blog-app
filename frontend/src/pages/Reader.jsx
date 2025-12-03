import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Reader() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);   // <-- loading state added
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/posts/public');
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);  // <-- hide loader when data fetched
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Latest Blogs</h1>

      <button
        onClick={() => navigate('/login?redirect=add-post')}
        className="bg-purple-600 text-white px-4 py-2 mb-6 rounded-lg hover:bg-purple-700 transition"
      >
        Add Post
      </button>

      {/* 🔥 SHOW LOADING */}
      {loading && (
        <div className="w-full flex   justify-center shadow-2xl py-20">
          <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* 🔥 HIDE POSTS WHILE LOADING */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-pink-200 rounded-xl shadow hover:shadow-lg transition p-4"
            >

              {/* FIXED UNIFORM IMAGE */}
              <div className="h-48 w-full overflow-hidden rounded-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <h2 className="text-xl font-bold mt-3">{post.title}</h2>

              <p className="text-gray-700 line-clamp-1">{post.short_desc}</p>
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
              <button
                onClick={() => navigate(`/reader/post/${post._id}`)}
                className="text-blue-600 mt-2 hover:underline"
              >
                Read more →
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
