import { useEffect, useState,useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function UserPosts() {
  console.log('user post render');
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const {user} =useContext(AuthContext)

  useEffect(() => {
    console.log(posts);
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await api.get(`/admin/users/${id}/posts`,{
      headers:{Authorization:`Bearer ${user.token}`}
    });

    setPosts(res.data);
  }
     catch (error) {
      console.log(error.response?.data ||error.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Blogs</h1>

      {posts.length === 0 && <p>No posts found.</p>}

      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p._id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="text-gray-600">{p.short_desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
