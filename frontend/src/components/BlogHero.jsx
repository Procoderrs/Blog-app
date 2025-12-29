import React from 'react'

const BlogHero = () => {
  return (
    <div className="relative w-full min-h-[50vh] max-h-[70vh] overflow-hidden">
      {/* Background Image */}
      <img
        src="./Wavy_Tech-07_Single-01.jpg"
        alt="Blog Hero"
        className="h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Centered Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-5xl font-bold uppercase">
          blogs blogs
        </h1>
      </div>
    </div>
  )
}

export default BlogHero
