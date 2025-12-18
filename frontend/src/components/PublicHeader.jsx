import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex justify-between items-center bg-[#F5F6FA] shadow-md rounded-xl py-3 px-8 md:px-16 mb-6 transition-colors duration-300">

        {/* Logo */}
        <div className="flex gap-3 items-center">
          <img src="/53122.jpg" alt="Logo" className="md:w-12 w-10 rounded-full shadow-sm" />
          <h1 className="md:text-3xl text-xl font-extrabold text-[#3B3363] tracking-tight">
            BlogStack
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              {/* User avatar + dropdown toggle */}
              <div
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[#2A2540] transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#7C6EE6] flex items-center justify-center text-white font-semibold uppercase text-lg shadow-md">
                  {user.name[0]}
                </div>
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ${openMenu ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown menu */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-[#1F1B2E] shadow-lg rounded-2xl py-2 z-20 border border-[#2A2540]">
                  <span className="font-semibold flex items-center gap-2 px-4 py-2 text-white">
                    👤 {user.name}
                  </span>
                  <Link
                    to="/dashboard/posts"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#2A2540] rounded-lg transition text-[#C7C5D1]"
                    onClick={() => setOpenMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/add-post"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#2A2540] rounded-lg transition text-[#C7C5D1]"
                    onClick={() => setOpenMenu(false)}
                  >
                    Add Post
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-[#3B3363] rounded-lg text-red-500 font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#3B3363] text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-[#7C6EE6] transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
