import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./middleware/AdminRoute";
import Reader from "./pages/Reader";
import ReaderSinglePost from "./pages/ReaderSinglePost";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AddPost from "./pages/dasboard/AddPost";
import UpdatePost from "./pages/dasboard/UpdatePost";
import FullPostPage from "./pages/FullPostPage";
import AddCategory from "./pages/dasboard/AddCategory";
import AllCategories from "./pages/dasboard/AllCategories";

import AdminLayout from "./admin/AdminLayout";
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
					{/* Public */}
					<Route path="/" element={<Reader />} />
  <Route path="/reader" element={<Reader />} />
  <Route path="/reader/post/:slug" element={<ReaderSinglePost />} />
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
						<Route index element={<Dashboard />} /> {/* /dashboard */}
						<Route path="posts" element={<Dashboard />} />{" "}
						{/* /dashboard/posts */}
						<Route path="add-post" element={<AddPost />} />{" "}
						{/* /dashboard/add-post */}
						<Route path="update-post/:slug" element={<UpdatePost />} />
						<Route path="post/:slug" element={<FullPostPage />} />
						<Route path="categories" element={<AllCategories />} />{" "}
						{/* /dashboard/categories */}
						<Route path="add-category" element={<AddCategory />} />{" "}
						
						{/* /dashboard/add-category */}
					</Route>

					{/* Admin Routes */}
					<Route
						path="/admin"
						element={
							<AdminRoute>
								<AdminLayout />
							</AdminRoute>
						}
					>
						<Route
							index
							element={
								<AdminRoute>
									<AdminDashboard />
								</AdminRoute>
							}
						/>
						<Route path="users" element={  <AdminRoute><Users /> </AdminRoute>} />
						<Route path="users/:id/posts" element={<AdminRoute><UserPosts /></AdminRoute>} />
						<Route path="categories" element={ <AdminRoute> <Categories /></AdminRoute>} />
						<Route path="/admin/update-post/:slug" element={<AdminRoute><AdminUpdatePost /></AdminRoute>
  }
/>
<Route path="/admin/post/:slug" element={<AdminFullPost />} />
<Route path="add-post" element={
  <AdminRoute>
    <AdminAddPost />
  </AdminRoute>
} />



					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;

/* VITE_API_URI=https://blog-app-mjc3.vercel.app
 */
