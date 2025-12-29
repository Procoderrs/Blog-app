// ===============================
// React Router
// ===============================
import { Outlet } from "react-router-dom";

// ===============================
// Components
// ===============================
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <>
      {/* Shared Header */}
      <PublicHeader />

      {/* Page Content */}
      <main className="min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>

      {/* Shared Footer */}
      <Footer />
    </>
  );
};

export default PublicLayout;
