import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import BottomNav from "../components/layout/BottomNav";
import NotificationPanel from "../components/layout/NotificationPanel";
import useSidebar from "../hooks/useSidebar";

const MainLayout = () => {
  const sidebar = useSidebar();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      <Sidebar {...sidebar} />

      <div
        className={`
          flex-1 min-w-0 flex flex-col transition-all duration-300
          ${sidebar.isTablet && !sidebar.collapsed ? "ml-64" : ""}
          ${sidebar.isTablet && sidebar.collapsed ? "ml-20" : ""}
          
        `}
      >
        <Navbar {...sidebar} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20">
          <Outlet />
        </main>
      </div>

      <NotificationPanel {...sidebar} />
      <BottomNav />
    </div>
  );
};

export default MainLayout;