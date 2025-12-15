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
    <header className="flex justify-between  top-0 items-center bg-[#EEEEEE] rounded-xl shadow-lg py-4 px-16 mb-6 relative">
      {/* Logo */}
      <div className="flex gap-3 items-center">
        <img src="/53122.jpg" alt="Logo" className="md:w-12 w-10 rounded" />
        <h1 className="md:text-3xl  text-xl font-bold text-purple-900">BlogStack</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 relative">
        {/* User logged in */}
        {user ? (
          <div className="relative">
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-purple-300 transition"
            >
              <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold uppercase">
                {user.name[0]}
              </div>
              <span className="font-semibold text-purple-900">{user.name}</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${openMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl py-2 z-20 border border-purple-100">
                <Link
                  to="/dashboard/posts"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-purple-100 rounded transition text-gray-800"
                  onClick={() => setOpenMenu(false)}
                >
                  Profile
                </Link>

                <Link
                  to="/dashboard/add-post"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-purple-100 rounded transition text-gray-800"
                  onClick={() => setOpenMenu(false)}
                >
                  Add Post
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-100 rounded text-red-600 font-semibold transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Login button
          <Link
            to="/login"
            className="bg-purple-700 text-white font-bold px-4 py-2 rounded-lg shadow hover:bg-purple-800 transition"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
