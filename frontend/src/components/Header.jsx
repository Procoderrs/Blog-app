import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center bg-purple-200 rounded-xl shadow p-4 mb-6 relative">
      {/* Logo */}
      <div className="flex gap-3 items-center">
        <img src="/blog.png" alt="" className="md:w-12 w-8" />
        <h1 className="text-2xl font-bold text-purple-900">StoryWave</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Add Post button */}
        <img
          src="/add.png"
          alt=""
          className="w-8 md:hidden"
          onClick={() => navigate("/add-post")}
        />
        
        {/* Profile Dropdown */}
        <div className="relative">
          <img
            src="/profileee.jpg"
            onClick={() => setOpenProfile(!openProfile)}
            className="rounded-lg w-12 cursor-pointer"
          />
          {openProfile && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl p-4 z-50">
              <p className="font-semibold text-purple-900 mb-3 border-b pb-2">
                👤 {user?.name}
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
