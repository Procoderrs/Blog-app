import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function AdminFullPost() {
  const { slug } = useParams(); // now URL contains slug
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/slug/${slug}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPost(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchPost();
  }, [slug, user]);

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto my-10 bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500 mb-2">
          {new Date(post.createdAt).toLocaleDateString()} | Author: {post.author?.name}
        </p>
        {post.category && (
          <span className="inline-block bg-purple-200 text-purple-900 px-3 py-1 rounded-full font-semibold mb-4">
            {post.category.name}
          </span>
        )}
        {post.image && <img src={post.image} alt={post.title} className="w-full rounded mb-4" />}
        <div dangerouslySetInnerHTML={{ __html: post.content }} className="prose"></div>

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
