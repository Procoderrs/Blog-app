// ===============================
// React
// ===============================
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#2F2858] text-gray-300 pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* ===============================
            Top Grid
        ================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-purple-700/40">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              BlogStack
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              A modern MERN stack blogging platform built for writers,
              developers, and creators who value performance and simplicity.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/reader" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/readerss" className="hover:text-white transition">
                  Explore Blogs
                </Link>
              </li>
              <li>
                <Link to="/category/technology" className="hover:text-white transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest posts and updates delivered to your inbox.
            </p>

            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 rounded-lg bg-[#3B3363] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ===============================
            Bottom Bar
        ================================ */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} BlogStack. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
