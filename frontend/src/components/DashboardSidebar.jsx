import { Link } from "react-router-dom";

export default function DashboardSidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5 space-y-4">
      <h2 className="text-xl font-bold mb-6">User Panel</h2>

      <nav className="flex flex-col space-y-3">
        <Link to="/dashboard/posts" className="hover:text-purple-400">All Posts</Link>
        <Link to="/dashboard/add-post" className="hover:text-purple-400">Add Post</Link>

        <hr className="border-gray-700" />

        <Link to="/dashboard/categories" className="hover:text-purple-400">All Categoriesssssssss</Link>
        <Link to="/dashboard/add-category" className="hover:text-purple-400">Add Category</Link>
      </nav>
    </div>
  );
}
