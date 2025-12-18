import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FileText, PlusCircle, Folder, Menu, BookOpen } from "lucide-react";

const DashboardLayout = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);

  const menuItems = [
    { name: "My Posts", path: "/dashboard/posts", icon: FileText },
    { name: "Add Post", path: "/dashboard/add-post", icon: PlusCircle },
    { name: "My Categories", path: "/dashboard/categories", icon: Folder },
    { name: "All Posts", path: "/reader", icon: BookOpen }, // Reader link
  ];

  return (
   <div className="flex min-h-screen bg-[#F5F6FA]">

  {/* Mobile Menu Button */}
  <button
    className="md:hidden fixed top-4 left-4 z-50 bg-[#1F1B2E] hover:bg-[#2A2540] p-2 rounded-lg text-white transition"
    onClick={() => setOpenSidebar(!openSidebar)}
  >
    <Menu className="w-6 h-6" />
  </button>

  {/* Sidebar */}
  <aside
    className={`bg-[#1F1B2E] shadow-xl p-4 flex flex-col justify-between
      fixed top-0 left-0 z-40 w-20 md:w-64 h-screen transform transition-transform duration-300
      ${openSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
  >
    <div className="space-y-8 w-full pt-6">
      <h1 className="hidden md:block text-lg font-semibold text-white tracking-tight">
        Dashboard
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-4 px-3 py-2.5 rounded-lg transition
                ${isActive
                  ? "bg-[#3B3363] text-white"
                  : "text-[#C7C5D1] hover:bg-[#2A2540] hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition" />
              <span className="hidden md:inline text-sm font-medium">
                {item.name}
              </span>

              {/* Tooltip for mobile */}
              <span className="absolute left-16 top-1/2 transform -translate-y-1/2
                bg-black text-white text-[10px] px-2 py-1 rounded opacity-0
                group-hover:opacity-100 transition md:hidden z-50">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>

    {/* Logout (Low Priority) */}
    {/* <button
      className="text-sm text-[#C7C5D1] hover:text-white transition"
      onClick={logout}
    >
      Logout
    </button> */}
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-6 ml-0 md:ml-64">
    <Outlet />
  </main>
</div>

  );
};

export default DashboardLayout;
