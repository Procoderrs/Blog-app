import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LoggedIn from "./components/LoggedIn";
import AddPost from "./pages/AddPost";
import UpdatePost from "./pages/UpdatePost";
import FullPostPage from "./pages/FullPostPage";
import Reader from "./pages/Reader";
import ReaderSinglePost from "./pages/ReaderSinglePost";


import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDasboard";
import Users from "./admin/pages/Users";
import UserPosts from "./admin/pages/UserPosts";
import Categories from "./admin/pages/Categories";
import AdminRoute from "./middleware/AdminRoute";
import "./App.css";

//VITE_API_URI=https://blog-app-mjc3.vercel.app


function App() {
	return (
		<BrowserRouter>
			<Routes>

<Route path="/" element={<Reader/>} />
<Route path="/reader/post/:id" element={<ReaderSinglePost/>} />


				<Route
					path="/register"
					element={
						<LoggedIn>
							<Register />
						</LoggedIn>
					}
				/>
				<Route
					path="/login"
					element={
						<LoggedIn>
							<Login />
						</LoggedIn>
					}
				/>

				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/add-post"
					element={
						<ProtectedRoute>
							<AddPost />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/update-post"
					element={
						<ProtectedRoute>
							<UpdatePost />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/post/:id"
					element={
						<ProtectedRoute>
							{" "}
							<FullPostPage />
						</ProtectedRoute>
					}
				/>

       <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
   <Route index element={<AdminRoute><AdminDashboard /></AdminRoute> } />   {/* Default dashboard */}
   <Route path="users" element={<Users />} />
   <Route path="users/:id/posts" element={<UserPosts />} />
   <Route path="categories" element={<Categories />} />
</Route>

			</Routes>
		</BrowserRouter>
	);
}

export default App;
