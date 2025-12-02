import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function UserPosts() {
  const { id } = useParams(); // user ID
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState(""); // store user name
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await api.get(`/admin/users/${id}/posts`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setPosts(res.data);

      // Set author name from first post or fallback
      if (res.data.length > 0) {
        setAuthorName(res.data[0].author?.name || "User");
      } else {
        setAuthorName("User");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const deletePost = async (postId) => {
    if (!confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const updatePost = (post) => {
    navigate("/update-post", { state: { post } });
  };

  const readFullBlog = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
  <Header />

  <div className="max-w-6xl mx-auto p-6">
    {/* Page Title */}
    <h1 className="text-3xl font-bold text-gray-800 mb-1">
      {authorName}'s Posts
    </h1>

    {posts.length === 0 && (
      <p className="text-gray-600 mt-4 text-lg">No posts found.</p>
    )}

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {posts.map((p) => (
        <div
          key={p._id}
          className="bg-white border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col"
        >
          {/* Image */}
          {/* {p.image && (
            <img
              src={`http://localhost:5000${p.image}`}
              alt={p.title}
              className="w-full h-56 md:h-48 lg:h-52 rounded-xl object-cover mb-3"
            />
          )} */}

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-1 line-clamp-1">
            {p.title}
          </h2>

          {/* Short Description */}
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {p.short_desc}
          </p>
          

          {/* Date */}
          <p className="text-xs text-gray-500 mb-4">
            {new Date(p.createdAt).toLocaleDateString()}
          </p>

          {/* Buttons */}
          <div className="mt-auto flex flex-wrap gap-2">
            <button
              onClick={() => updatePost(p)}
              className="flex-1 bg-purple-500 text-white py-2 rounded-lg text-sm hover:bg-purple-600 transition"
            >
              Update
            </button>

            <button
              onClick={() => deletePost(p._id)}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition"
            >
              Delete
            </button>

            <button
              onClick={() => readFullBlog(p._id)}
              className="flex-1 bg-purple-700 text-white py-2 px-1 rounded-lg text-sm hover:bg-purple-800 transition"
            >
              Full Blog
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
}
