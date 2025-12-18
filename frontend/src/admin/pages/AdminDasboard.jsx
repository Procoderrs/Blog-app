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
      setPosts(res.data.totalPosts || 0);
      console.log(res.data);
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
    <div className="min-h-screen bg-[#f5f3f7] ">
      <Header />

      {/* Admin Welcome */}
      <div className="px-8 py-6">

     
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#3a3350] tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back, {user?.name} 👋</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users */}
        <div className="bg-[#1F1B2E] border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-md transition">
  <p className="text-sm font-medium text-gray-200 uppercase tracking-wide">
    Total Users
  </p>
  <p className="text-4xl font-bold text-[#A7B4D6] mt-3">
    {users.length}
  </p>
</div>


        {/* Posts */}
        <div className="bg-[#1F1B2E] border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-md transition">
  <p className="text-sm font-medium text-gray-200 uppercase tracking-wide">
    Total Posts
  </p>
  <p className="text-4xl font-bold text-[#A7B4D6] mt-3">
    {posts}
  </p>
</div>


        {/* Categories */}
        <div className="bg-[#1F1B2E] border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-md transition">
  <p className="text-sm font-medium text-gray-200 uppercase tracking-wide">
    Total Categories
  </p>
  <p className="text-4xl font-bold text-[#A7B4D6] mt-3">
    {categories.length}
  </p>
</div>
      </div>
    </div>
     </div>
  );
}
