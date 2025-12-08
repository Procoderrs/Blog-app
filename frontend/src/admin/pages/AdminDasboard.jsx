import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";

export default function AdminDashboard() {
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
        const res = await api.get("/categories", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.log("Fetch categories error:", err.response?.data || err.message);
      }
    };


    
  return (
    <div className="min-h-screen bg-gray-100 ">
      <Header />

      {/* Admin Welcome */}
      <div className="px-8 py-5">

     
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-purple-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome, {user?.name} 👋</p>
      </div>

      {/* Dashboard Stats */}
      <div className="flex flex-wrap justify-between gap-6">
        {/* Users */}
        <div className="bg-linear-to-br from-purple-200 to-pink-200 rounded-xl shadow-lg p-10 text-center w-72">
          <p className="text-gray-700 font-medium">Total Users</p>
          <p className="text-3xl font-bold mt-2">{users.length}</p>
        </div>

        {/* Posts */}
        <div className="bg-linear-to-br from-purple-200 to-pink-200 rounded-xl shadow-lg p-10 text-center w-72">
          <p className="text-gray-700 font-medium">Total Posts</p>
          <p className="text-3xl font-bold mt-2">{posts.length}</p>
        </div>

        {/* Categories */}
        <div className="bg-linear-to-br from-purple-200 to-pink-200 rounded-xl shadow-lg p-10 text-center w-72">
          <p className="text-gray-700 font-medium">Total Categories</p>
          <p className="text-3xl font-bold mt-2">{categories.length}</p>
        </div>
      </div>
    </div>
     </div>
  );
}
