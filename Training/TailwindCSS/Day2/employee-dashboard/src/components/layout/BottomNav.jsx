import { NavLink } from "react-router-dom";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";

const BottomNav = () => {
  const navItems = [
    { path: "/", icon: <FiHome />, label: "Home" },
    { path: "/employees", icon: <FiUsers />, label: "Employees" },
    { path: "/settings", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <div className="
      fixed bottom-0 left-0 right-0
      bg-white dark:bg-gray-900
      border-t dark:border-gray-700
      flex justify-around items-center
      py-2
      md:hidden
      z-20
    ">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `
            flex flex-col items-center
            text-xs
            transition-all duration-200
            ${
              isActive
                ? "text-primary scale-110"
                : "text-gray-500 dark:text-gray-400"
            }
            `
          }
        >
          <span className="text-xl">{item.icon}</span>
          <span className="mt-1">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;