import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import { AuthContext } from "../context/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleStartWriting = () => {
    if (user) navigate("/dashboard/add-post");
    else navigate("/login");
  };

  const handleExploreBlogs = () => {
    navigate("/readerss");
  };

  return (
    <section className="bg-[#DFD3E4] min-h-screen">
      <PublicHeader />

      <div className="max-w-6xl mx-auto px-6">
        {/* Card Container */}
        <div className="bg-[#DFD3E4] rounded-3xl  px-10 py-20 text-center">

          {/* Trust Badge */}
          {/* <div className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-sm bg-[#F1E6DA] rounded-full text-gray-700">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Trusted by 10,000+ Writers
          </div> */}

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-[#3B3363] leading-tight mb-6">
            Write Smarter.
            <br />
            Publish Faster.
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
            Turn your ideas into published stories with a fast, intuitive blogging experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center flex-wrap gap-4">
            <button
              onClick={handleStartWriting}
              className="px-8 py-3 rounded-full bg-[#7c6ee6] text-white font-semibold hover:bg-[#6a5be2] transition"
            >
              Start Writing Free →
            </button>

            <button
              onClick={handleExploreBlogs}
              className="px-8 py-3 rounded-full border border-[#7c6ee6] text-[#7c6ee6] font-semibold hover:bg-orange-50 transition"
            >
              See How It Works
            </button>
          </div>

          {/* Brand Row */}
          {/* <div className="mt-16">
            <p className="text-sm text-gray-500 mb-6">Trusted by writers at</p>
            <div className="flex justify-center flex-wrap gap-10 opacity-70">
              <span className="font-semibold">Google</span>
              <span className="font-semibold">Samsung</span>
              <span className="font-semibold">Webflow</span>
              <span className="font-semibold">Forbes</span>
              <span className="font-semibold">Framer</span>
            </div>
          </div>
 */}
        </div>
      </div>
    </section>
  );
}
