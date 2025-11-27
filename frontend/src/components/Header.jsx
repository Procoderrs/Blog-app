import React from 'react'
import { AuthContext } from '../context/AuthContext';
import { useContext,useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const { user, logout } = useContext(AuthContext);

    const [openProfile, setOpenProfile] = useState(false);
  
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
     <div className="flex justify-between items-center bg-purple-200 rounded-xl shadow p-4 mb-6 relative">
        <div className="flex gap-3 items-center">
          <img src="/blog.png" alt="" className="w-12" />
          <h1 className="text-2xl font-bold text-purple-900">StoryWave</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/add-post")}
            className="bg-[#33006F] text-white px-6 py-3 rounded-lg shadow hover:bg-purple-600 transition"
          >
            Add Post
          </button>

          <div className="relative">
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="bg-purple-700 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-800 transition"
            >
              Profile
            </button>

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
    </>
  )
}

export default Header