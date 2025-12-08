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
    <div className="lg:w-64 w-16 bg-purple-200 shadow-lg p-4 space-y-6 flex flex-col items-center lg:items-start">
      <div className="flex items-center gap-3">
        {admin?.avatar ? (
          <img src={admin.avatar} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <UserCircle className="w-10 h-10" />
        )}
        <span className="hidden lg:inline text-xl font-bold">
          {admin?.name || "Admin"}
        </span>
      </div>

      <nav className="space-y-3 w-full">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded font-bold hover:bg-gray-300 ${
              isActive ? "bg-gray-300 text-purple-900" : ""
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
              isActive ? "bg-gray-300 text-purple-900" : ""
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
              isActive ? "bg-gray-300 text-purple-900" : ""
            }`
          }
        >
          <Folder className="w-6 h-6" />
          <span className="hidden lg:inline">Categories</span>
        </NavLink>
      </nav>
    </div>
  );
}
