import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

 function AdminLayout() {
  console.log('admin layout render');
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 px-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
export default React.memo(AdminLayout)