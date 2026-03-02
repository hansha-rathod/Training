import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import NotificationPanel from "../components/layout/NotificationPanel";
import useSidebar from "../hooks/useSidebar";

const MainLayout = () => {
  const sidebar = useSidebar();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">

      <Sidebar {...sidebar} />

      <div
        className={`
          flex-1 transition-all duration-300
          ${sidebar.isDesktop && !sidebar.collapsed ? "ml-64" : ""}
          ${sidebar.isDesktop && sidebar.collapsed ? "ml-20" : ""}
        `}
      >
        <Navbar {...sidebar} />

        <main className="p-4 pb-20">
          <Outlet />
        </main>
      </div>

      <NotificationPanel {...sidebar} />
      <BottomNav />
    </div>
  );
};

export default MainLayout;