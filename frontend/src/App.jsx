import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./middleware/AdminRoute";
import Reader from './pages/Reader';
import ReaderSinglePost from './pages/ReaderSinglePost'

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AddPost from "./pages/AddPost";
import UpdatePost from "./pages/UpdatePost";
import FullPostPage from "./pages/FullPostPage";
import AddCategory from "./pages/dasboard/AddCategory";
import AllCategories from "./pages/dasboard/AllCategories";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDasboard";
import Users from "./admin/pages/Users";
import UserPosts from "./admin/pages/UserPosts";
import Categories from "./admin/pages/Categories";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Reader />} />
          <Route path="/reader/post/:id" element={<ReaderSinglePost />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* User Dashboard */}
          {/* User Dashboard */}
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<Dashboard />} />           {/* /dashboard */}
  <Route path="posts" element={<Dashboard />} />   {/* /dashboard/posts */}
  <Route path="add-post" element={<AddPost />} />  {/* /dashboard/add-post */}
  <Route path="update-post" element={<UpdatePost />} />
  <Route path="post/:id" element={<FullPostPage />} />
  <Route path="categories" element={<AllCategories />} />      {/* /dashboard/categories */}
  <Route path="add-category" element={<AddCategory />} />       {/* /dashboard/add-category */}
</Route>


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id/posts" element={<UserPosts />} />
            <Route path="categories" element={<Categories />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
