import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  console.log("admin sidebar render");
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-white shadow-lg p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <nav className="space-y-3">
        <NavLink to="/admin" className="block p-2 hover:bg-gray-200 rounded">
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="block p-2 hover:bg-gray-200 rounded">
          Users
        </NavLink>

        <NavLink to="/admin/categories" className="block p-2 hover:bg-gray-200 rounded">
          Categories
        </NavLink>

        <button
          className="block p-2 bg-red-500 text-white rounded mt-6 w-full"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

// ✅ Apply memo correctly here
export default React.memo(AdminSidebar);
