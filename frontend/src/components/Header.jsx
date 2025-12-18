import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center bg-white rounded-2xl shadow-md p-4 mb-6 relative">
      
      {/* Logo */}
      <div className="flex gap-3 items-center">
        <img
          src="/53122.jpg"
          alt="Logo"
          className="md:w-12 w-10 rounded-full shadow-sm"
        />
        <h1 className="md:text-2xl text-xl font-extrabold tracking-tight text-[#3B3363]">
          BlogStack
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <img
            src="/profileee.jpg"
            onClick={() => setOpenProfile(!openProfile)}
            className="rounded-full w-11 cursor-pointer border border-[#C7C5D1] hover:shadow-lg transition-all duration-200"
          />

          {openProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-[#1F1B2E] shadow-lg rounded-2xl p-4 z-50 border border-[#2A2540]">
              <p className="font-semibold text-sm text-white mb-3 border-b border-[#2A2540] pb-2">
                👤 {user?.name}
              </p>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white font-medium py-2.5 rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
