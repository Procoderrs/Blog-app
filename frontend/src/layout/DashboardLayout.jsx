import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FileText, PlusCircle, Folder, Menu } from "lucide-react";

const DashboardLayout = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);

  const menuItems = [
    { name: "My Posts", path: "/dashboard/posts", icon: FileText },
    { name: "Add Post", path: "/dashboard/add-post", icon: PlusCircle },
    { name: "My Categories", path: "/dashboard/categories", icon: Folder },
    
  ];

  return (
    <div className="flex min-h-screen bg-[#E8E2E2]">

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#603F83] p-2 rounded text-white"
        onClick={() => setOpenSidebar(!openSidebar)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-[#603F83] shadow-lg p-4 flex flex-col justify-between
          fixed  top-0 left-0 z-40 w-20 md:w-64 h-screen transform transition-transform duration-300
          ${openSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="space-y-6 w-full pt-6">

          {/* Dashboard Title - md+ */}
          <h1 className="hidden md:block text-2xl font-bold text-[#D6ED17] mb-4">
            User Dashboard
          </h1>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-4 p-2 rounded hover:bg-[#4C1F7A] transition
                  ${location.pathname === item.path ? "bg-[#4C1F7A] text-white" : "text-[#E8E2E2]"}`}
              >
                <item.icon className="w-6 h-6" />
                <span className="hidden md:inline">{item.name}</span>

                {/* Tooltip on mobile */}
                <span className="absolute left-16 top-1/2 transform -translate-y-1/2
                  bg-black text-white text-[10px] px-2 py-1 rounded opacity-0
                  group-hover:opacity-100 transition md:hidden z-50">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Optional Logout Button */}
        {/* Uncomment if needed */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0  md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
