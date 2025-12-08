import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center bg-purple-200 rounded-xl shadow p-4 mb-6">
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
          className="w-8 md:hidden cursor-pointer"
          onClick={() => navigate("/login?redirect=add-post")}
        />
        <p>
        <Link to='/login'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default PublicHeader;
