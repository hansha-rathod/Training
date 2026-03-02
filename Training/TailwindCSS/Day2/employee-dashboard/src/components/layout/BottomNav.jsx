import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 flex justify-around py-2 md:hidden z-20">
      <NavLink to="/">🏠</NavLink>
      <NavLink to="/employees">👥</NavLink>
      <NavLink to="/settings">⚙️</NavLink>
    </div>
  );
};

export default BottomNav;