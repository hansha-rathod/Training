const Navbar = ({
  toggleSidebar,
  setNotificationOpen
}) => {
  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex justify-between items-center">
      
      {/* Hamburger */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden text-xl"
      >
        ☰
      </button>

      <h1 className="font-semibold">Dashboard</h1>

      {/* Notification */}
      <button
        onClick={() => setNotificationOpen(prev => !prev)}
        className="relative"
      >
        🔔
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
    </header>
  );
};

export default Navbar;