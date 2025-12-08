// src/layouts/DashboardLayout.jsx
import React, { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: "My Posts", path: "/dashboard/posts" },
    { name: "Add Post", path: "/dashboard/add-post" },
    { name: "My Categories", path: "/dashboard/categories" },
    { name: "Add Category", path: "/dashboard/add-category" },
    // Users/Add User removed since admin handles them
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-50 shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-900 mb-6">Dashboard</h1>
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded hover:bg-purple-200 transition ${
                  location.pathname === item.path ? "bg-purple-200 font-semibold" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
