import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicHeader from "./PublicHeader";
import { AuthContext } from "../context/AuthContext";


/* ===============================
   Reusable Section Component
=============================== */
function FeatureSection({ title, description, image, reverse = false, showButton = false, onAction }) {
  return (
    <div className={`max-w-7xl mx-auto px-16 py-12 min-h-[calc(100vh-80px)] flex items-center ${reverse ? "bg-[#b5b8ff]" : "bg-[#c6bbfa]"}`}>
      <div className={`flex w-full items-center gap-12 ${reverse ? "flex-col-reverse md:flex-row-reverse" : "flex-col-reverse md:flex-row"}`}>
        {/* TEXT */}
        <div className="flex-1">
          <div className="min-h-[180px] flex items-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#3B3363] leading-tight whitespace-pre-line">
              {title}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl">
            {description}
          </p>

          {showButton && (
            <div className="inline-block transition-transform duration-700 ease-out translate-y-2">
              <button
                onClick={onAction}
                className="px-8 py-3 rounded-full bg-[#7c6ee6] text-white font-semibold hover:bg-[#6a5be2] transition"
              >
                Start Writing Free →
              </button>
            </div>
          )}
        </div>

        {/* IMAGE */}
        <div className="flex-1 flex justify-center">
          <img
            src={image}
            alt="Feature illustration"
            className="w-full max-w-md max-h-[520px] rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}

/* ===============================
   Main Hero Component
=============================== */
export default function Hero() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleStartWriting = () => {
    if (user) navigate("/dashboard/add-post");
    else navigate("/login");
  };

  /* ===============================
     Typewriter effect only in Hero
  =============================== */
  const fullText = "Write Smarter.\nPublish Faster.";
  const typingSpeed = 90;
  const resetDelay = 1600;

  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= fullText.length) return;

    const timeout = setTimeout(() => {
      setDisplayText((prev) => prev + fullText[index]);
      setIndex((prev) => prev + 1);
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [index, fullText]);

  useEffect(() => {
    if (index !== fullText.length) return;

    const resetTimeout = setTimeout(() => {
      setDisplayText("");
      setIndex(0);
    }, resetDelay);

    return () => clearTimeout(resetTimeout);
  }, [index, fullText]);

  return (
   <>
   
   <section className=" min-h-screen">
      

      {/* ================= HERO SECTION ================= */}
      <div className=" mx-auto bg-[#e5dded] px-16 py-12  flex items-center">
        <div className="flex w-full items-center gap-12 flex-col-reverse md:flex-row">
          <div className="flex-1">
            <div className="min-h-[180px] flex items-center">
              <h1 className="text-5xl md:text-6xl font-bold text-[#3B3363] leading-tight whitespace-pre-line">
                {displayText}
                <span className="animate-pulse ml-1">
                  <i className="ri-quill-pen-ai-line"></i>
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl">
              A modern blogging platform designed for speed, clarity, and focus — so you can write without friction.
            </p>

            <div
              className={`inline-block transition-transform duration-700 ease-out ${
                index === fullText.length ? "translate-y-2" : "-translate-y-2"
              }`}
            >
              <button
                onClick={handleStartWriting}
                className="px-8 py-3 rounded-full bg-[#7c6ee6] text-white font-semibold hover:bg-[#6a5be2] transition"
              >
                Start Writing Free →
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <img
              src="./imggg.png"
              alt="Hero illustration"
              className="w-full max-w-md max-h-[520px] rounded-lg object-contain"
            />
          </div>
        </div>
      </div>

      {/* ================= SECTION 2 ================= */}
      {/* <FeatureSection
        title={"Organize Ideas.\nStay in Control."}
        description={"Create, edit, and manage your posts from a clean dashboard built for writers who value structure and simplicity."}
        image="./blue-img.png"
        reverse
      /> */}

      {/* ================= SECTION 3 ================= */}
      {/* <FeatureSection
        title={"Reach Readers.\nGrow Your Voice."}
        description={"Publish instantly and let your stories reach readers who care. Built-in discovery makes your content visible."}
        image="./img-4jpeg copy.jpeg"
        
        onAction={handleStartWriting}
      /> */}


    </section>
    </>
  );
}
