import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function AdminFullPost() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/slug/${slug}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPost(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, user]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
          Loading post...
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <p className="text-center text-gray-500 mt-10">Post not found.</p>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Header />

      <div className="max-w-4xl mx-auto my-10 bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Cover Image */}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-80 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-semibold text-[#3B3363] mb-2">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
            <span>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span className="font-medium text-[#3B3363]">
              {post.author?.name}
            </span>
          </div>

          {post.category && (
            <span className="inline-block bg-[#F0EEFF] text-[#3B3363] px-4 py-1 rounded-full text-xs font-medium mb-6">
              {post.category.name}
            </span>
          )}

          {/* Blog Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#3B3363] prose-p:text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="bg-[#7C6EE6] hover:bg-[#6A5BE2] text-white px-5 py-2 rounded-lg text-sm transition"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
