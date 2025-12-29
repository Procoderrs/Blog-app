// ===============================
// React & Hooks
// ===============================
import React, { useContext, useState } from "react";

// ===============================
// Context & Routing
// ===============================
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
	// ===============================
	// Context & State
	// ===============================
	const { user, logout } = useContext(AuthContext);
	const [openProfile, setOpenProfile] = useState(false);
	const navigate = useNavigate();

	// ===============================
	// Logout Handler
	// ===============================
	const handleLogout = () => {
		logout();
		navigate("/");
	};

	return (
		<header
			className="
				flex
				justify-between
				items-center
				bg-white
				rounded-2xl
				shadow-md
				p-4
				mb-6
				relative
			"
		>
			{/* ===============================
				Logo Section
			================================ */}
			<div className="flex items-center gap-3">
				<img
					src="/53122.jpg"
					alt="BlogStack Logo"
					className="w-10 md:w-12 rounded-full shadow-sm"
				/>

				<h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#3B3363]">
					BlogStack
				</h1>
			</div>

			{/* ===============================
				User Actions
			================================ */}
			<div className="flex items-center gap-4">
				{/* Profile Dropdown */}
				<div className="relative">
					<img
						src="/profileee.jpg"
						alt="User Profile"
						onClick={() => setOpenProfile((prev) => !prev)}
						className="
							w-11
							rounded-full
							cursor-pointer
							border
							border-[#C7C5D1]
							hover:shadow-lg
							transition-all
							duration-200
						"
					/>

					{openProfile && (
						<div
							className="
								absolute
								right-0
								mt-3
								w-48
								bg-[#1F1B2E]
								rounded-2xl
								shadow-lg
								p-4
								z-50
								border
								border-[#2A2540]
							"
						>
							{/* User Name */}
							<p className="font-semibold text-sm text-white mb-3 border-b border-[#2A2540] pb-2">
								👤 {user?.name}
							</p>

							{/* Logout Button */}
							<button
								onClick={handleLogout}
								className="
									w-full
									bg-red-500
									hover:bg-red-600
									text-white
									font-medium
									py-2.5
									rounded-lg
									transition-all
									duration-200
								"
							>
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
