import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context
import AuthProvider from "./context/AuthContext";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./middleware/AdminRoute";

// Layouts
import PublicLayout from "./layout/PublicLayout";
import DashboardLayout from "./layout/DashboardLayout";
import AdminLayout from "./admin/AdminLayout";

// Public Pages
import Reader from "./pages/Reader";
import ReaderSinglePost from "./pages/ReaderSinglePost";
import CategoryPage from "./pages/CategoryPage";
import ExploreBlogs from "./pages/ExploreBlogs";
import About from "./components/About";
import BlogHero from "./components/BlogHero";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Dashboard Pages
import Dashboard from "./pages/Dashboard";
import AddPost from "./pages/dasboard/AddPost";
import UpdatePost from "./pages/dasboard/UpdatePost";
import FullPostPage from "./pages/FullPostPage";
import AddCategory from "./pages/dasboard/AddCategory";
import AllCategories from "./pages/dasboard/AllCategories";

// Admin Pages
import AdminDashboard from "./admin/pages/AdminDasboard";
import Users from "./admin/pages/Users";
import UserPosts from "./admin/pages/UserPosts";
import Categories from "./admin/pages/Categories";
import AdminUpdatePost from "./admin/pages/AdminUpdatePost";
import AdminFullPost from "./admin/pages/AdminFullPost";
import AdminAddPost from "./admin/pages/AdminAddPost";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ===============================
              Public Layout (Header + Footer)
          ================================ */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Reader />} />
            <Route path="/reader" element={<Reader />} />
            <Route path="/reader/post/:slug" element={<ReaderSinglePost />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/readerss" element={<ExploreBlogs />} />
            <Route path="/about" element={<About />} />
						<Route path="/blog" element={<BlogHero />} />

						
          </Route>

          {/* ===============================
              Auth Routes (No Header/Footer)
          ================================ */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ===============================
              User Dashboard (Protected)
          ================================ */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<Dashboard />} />
            <Route path="add-post" element={<AddPost />} />
            <Route path="update-post/:slug" element={<UpdatePost />} />
            <Route path="post/:slug" element={<FullPostPage />} />
            <Route path="categories" element={<AllCategories />} />
            <Route path="add-category" element={<AddCategory />} />
          </Route>

          {/* ===============================
              Admin Routes (Admin Only)
          ================================ */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id/posts" element={<UserPosts />} />
            <Route path="categories" element={<Categories />} />
            <Route path="add-post" element={<AdminAddPost />} />
            <Route path="update-post/:slug" element={<AdminUpdatePost />} />
            <Route path="post/:slug" element={<AdminFullPost />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
