import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  console.log('admin dashboard render');

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get("/admin/posts", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600 mb-6">Welcome Admin 👋</p>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users */}
        <div className="bg-linear-to-br from-purple-200 to-pink-200 rounded-xl shadow-lg p-6 text-center w-72 mx-auto">
          <p className="text-gray-700 font-medium">Total Users</p>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>

        {/* Posts */}
        <div className="bg-linear-to-br from-purple-200 to-pink-200 rounded-xl shadow-lg p-6 text-center w-72 mx-auto">
          <p className="text-gray-700 font-medium">Total Posts</p>
          <p className="text-3xl font-bold mt-2">{posts.length}</p>
        </div>

        {/* Categories */}
        <div className="bg-linear-to-br from-purple-200 to-pink-200 rounded-xl shadow-lg p-6 text-center w-72 mx-auto">
          <p className="text-gray-700 font-medium">Total Categories</p>
          <p className="text-3xl font-bold mt-2">{categories.length}</p>
        </div>
      </div>
    </div>
  );
}
