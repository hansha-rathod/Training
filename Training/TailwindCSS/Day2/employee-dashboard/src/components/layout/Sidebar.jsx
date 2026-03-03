import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiSettings, FiMenu } from "react-icons/fi";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Employees", path: "/employees", icon: <FiUsers /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <aside
      className={`
        hidden md:flex flex-col
        fixed top-0 left-0 h-full z-40
        bg-white dark:bg-gray-900
        border-r dark:border-gray-700
        shadow-lg
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        {!collapsed && (
          <span className="text-lg font-bold text-gray-800 dark:text-white">
            Admin
          </span>
        )}

        <button
          onClick={toggleSidebar}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          <FiMenu />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
              flex items-center
              ${collapsed ? "justify-center" : "gap-3"}
              px-3 py-3
              rounded-lg
              transition-all duration-200
              ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `
            }
          >
            <span className="text-xl">{item.icon}</span>

            {!collapsed && (
              <span className="whitespace-nowrap">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;