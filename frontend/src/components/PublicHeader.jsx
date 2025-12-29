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
      <div className="flex justify-between items-center bg-[#E8E2F7] shadow-md py-3 px-4 md:px-16">
        
        {/* Logo */}
        <div
          className="flex gap-3 items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/53122.jpg"
            alt="Logo"
            className="w-10 md:w-12 rounded-full"
          />
          <h1 className="text-xl md:text-3xl font-extrabold text-[#3B3363]">
            BlogStack
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-4">
          {user ? (
            <>
              {/* Home */}
              <button
                onClick={() => navigate("/reader")}
                className="flex items-center justify-center bg-[#3B3363] text-white rounded-lg px-3 py-2 hover:bg-purple-700 transition"
              >
                <span className="md:hidden">🏠</span>
                <span className="hidden md:inline font-semibold text-sm">
                  Home
                </span>
              </button>

              {/* Write */}
              <button
                onClick={() => navigate("/dashboard/add-post")}
                className="flex items-center justify-center bg-[#3B3363] text-white rounded-lg px-3 py-2 hover:bg-purple-700 transition"
              >
                <span className="md:hidden"><i class="ri-pencil-ai-2-fill"></i></span>
                <span className="hidden md:inline font-semibold text-sm">
                  Write
                </span>
              </button>

              {/* about us */}

              {/* <button
                onClick={() => navigate("/about")}
                className="flex items-center justify-center bg-[#3B3363] text-white rounded-lg px-3 py-2 hover:bg-purple-700 transition"
              >
                <span className="md:hidden"><i class="ri-pencil-ai-fill"></i></span>
                <span className="hidden md:inline font-semibold text-sm">
                  about us
                </span>
              </button> */}

              {/* User Menu */}
              <div className="relative">
                <div
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-purple-100"
                >
                  <div className="w-9 h-9 rounded-full bg-[#3B3363] flex items-center justify-center text-white font-semibold">
                    {user.name[0]}
                  </div>
                  <svg
                    className={`w-4 h-4 hidden md:block transition-transform ${
                      openMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-xl py-2 z-20 border">
                    <span className="block px-4 py-2 text-sm font-semibold">
                      {user.name}
                    </span>

                    <Link
                      to="/dashboard/posts"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                      onClick={() => setOpenMenu(false)}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Home */}
              <button
                onClick={() => navigate("/reader")}
                className="flex items-center justify-center bg-[#3B3363] text-white rounded-lg px-3 py-2 hover:bg-purple-700 transition"
              >
                <span className="md:hidden">🏠</span>
                <span className="hidden md:inline font-semibold text-sm">
                  Home
                </span>
              </button>

              {/* Login */}
              <Link
                to="/login"
                className="flex items-center justify-center bg-[#7c6ee6] text-white rounded-lg px-3 py-2 hover:bg-[#6a5be2] transition"
              >
                <span className="md:hidden">🔐</span>
                <span className="hidden md:inline font-bold text-sm">
                  Login
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
