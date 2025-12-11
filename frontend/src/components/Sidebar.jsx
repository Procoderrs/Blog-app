// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ user }) => {
  // Menu items for all users
  const menuItems = [
    { name: "My Posts", path: "/dashboard/posts" },
    { name: "Add Post", path: "/dashboard/add-post" },
    { name: "My Categories", path: "/dashboard/categories" },
    { name: "Add Category", path: "/dashboard/add-category" },
  ];

  return (
    <div className="bg-purple-100 w-64 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-purple-900">Dashboarddddd</h2>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded hover:bg-purple-200 transition ${
                isActive ? "bg-purple-300 font-semibold" : ""
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
