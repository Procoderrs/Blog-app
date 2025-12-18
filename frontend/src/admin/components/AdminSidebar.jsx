import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Folder, UserCircle } from "lucide-react";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";

export default function AdminSidebar() {
  const { user } = useContext(AuthContext);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!user?.token) return;
      try {
        const res = await api.get("/admin/me", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        console.error("Admin fetch error:", err);
      }
    };
    fetchAdmin();
  }, [user]);

  return (
    <div className="lg:w-64 w-16 bg-[#1F1B2E] shadow-lg p-4 space-y-6 flex flex-col items-center lg:items-start">
      <div className="flex items-center gap-3">
        {admin?.avatar ? (
          <img src={admin.avatar} className="w-10 h-10  rounded-full object-cover" />
        ) : (
          <UserCircle className="w-10 h-10 text-white" />
        )}
        <span className="hidden lg:inline  text-lg font-semibold text-white tracking-tight">
          {admin?.name || "Admin"}
        </span>
      </div>

      <nav className="space-y-3 w-full">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded font-bold hover:bg-gray-300 ${
              isActive ? "bg-[#3B3363] text-white" : "text-[#C7C5D1] hover:bg-[#2A2540] hover:text-white"
            }`
          }
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="hidden lg:inline">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded font-bold hover:bg-gray-300 ${
              isActive ? "bg-[#3B3363] text-white" : "text-[#C7C5D1] hover:bg-[#2A2540] hover:text-white"
            }`
          }
        >
          <Users className="w-6 h-6" />
          <span className="hidden lg:inline">Users</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded font-bold hover:bg-gray-300 ${
              isActive ?"bg-[#3B3363] text-white" : "text-[#C7C5D1] hover:bg-[#2A2540] hover:text-white"
            }`
          }
        >
          <Folder className="w-6 h-6" />
          <span className="hidden lg:inline">Categories</span>
        </NavLink>

        <NavLink
  to="/admin/add-post"
  className={({ isActive }) =>
    `flex items-center gap-3 p-2 rounded font-bold hover:bg-gray-300 ${
      isActive ?"bg-[#3B3363] text-white" : "text-[#C7C5D1] hover:bg-[#2A2540] hover:text-white"
    }`
  }
>
  <Folder className="w-6 h-6" />
  <span className="hidden lg:inline">Add Post</span>
</NavLink>
      </nav>
    </div>
  );
}
