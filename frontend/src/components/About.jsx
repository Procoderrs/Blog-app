// ===============================
// React
// ===============================
import React from "react";

// ===============================
// Animation
// ===============================
import { motion } from "framer-motion";

// ===============================
// Components
// ===============================
import PublicHeader from "../components/PublicHeader";

export default function About() {
  return (
    <>
      

      {/* ===============================
          HERO SECTION
      ================================ */}
      <section className="bg-[#F4F1FB] py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-[#3B3363]"
          >
            About BlogStack
          </motion.h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            BlogStack is a modern blogging platform built with the MERN stack,
            designed for writers who value simplicity, speed, and control.
          </p>
        </div>
      </section>

      {/* ===============================
          MISSION SECTION
      ================================ */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold text-[#3B3363]">
              Our Mission
            </h2>

            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Our mission is to empower creators by removing unnecessary
              complexity from publishing. BlogStack gives you a clean writing
              experience, powerful content management, and seamless publishing
              — all in one place.
            </p>

            <p className="mt-4 text-gray-600 text-lg leading-relaxed">
              Whether you are a developer, writer, or storyteller, BlogStack
              adapts to your workflow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <img
              src="/about-mission.png"
              alt="Our Mission"
              className="max-w-md w-full rounded-xl shadow-lg object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* ===============================
          WHY BLOGSTACK
      ================================ */}
      <section className="bg-[#F9F8FE] py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-[#3B3363] mb-12">
            Why Choose BlogStack?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Modern Stack",
                desc: "Built using MongoDB, Express, React, and Node for performance and scalability.",
              },
              {
                title: "Writer Focused",
                desc: "Minimal UI designed to keep you focused on writing, not fighting the editor.",
              },
              {
                title: "Fast Publishing",
                desc: "Optimized APIs and caching for instant publishing and reading.",
              },
              {
                title: "Secure & Scalable",
                desc: "JWT authentication, role-based access, and secure data handling.",
              },
              {
                title: "Responsive Design",
                desc: "Looks great on mobile, tablet, and desktop devices.",
              },
              {
                title: "Open to Growth",
                desc: "Built to support categories, comments, analytics, and future features.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-md p-6 text-left"
              >
                <h3 className="text-xl font-semibold text-[#3B3363]">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===============================
          TECH STACK
      ================================ */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-[#3B3363]">
            Technology Behind BlogStack
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Built with modern technologies for reliability and performance.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "Framer Motion"].map(
              (tech) => (
                <span
                  key={tech}
                  className="px-6 py-3 bg-[#EDE8FB] text-[#3B3363] font-semibold rounded-full shadow-sm"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===============================
          CTA
      ================================ */}
      <section className="bg-[#3B3363] py-20 px-6 md:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Start Writing With BlogStack
        </h2>

        <p className="mt-4 text-lg text-purple-200 max-w-xl mx-auto">
          Join a platform built for creators who care about quality and speed.
        </p>

        <div className="mt-8">
          <button className="px-8 py-3 rounded-full bg-[#7c6ee6] text-white font-semibold hover:bg-[#6a5be2] transition">
            Get Started
          </button>
        </div>
      </section>
    </>
  );
}
