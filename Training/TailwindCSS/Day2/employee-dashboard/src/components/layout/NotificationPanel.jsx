const NotificationPanel = ({
  notificationOpen,
  setNotificationOpen
}) => {
  return (
    <>
      {notificationOpen && (
        <div
          onClick={() => setNotificationOpen(false)}
          className="fixed inset-0 bg-black/40 z-30"
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-80
          bg-white dark:bg-gray-900
          shadow-xl z-40
          transform transition-transform duration-300
          ${notificationOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold">Notifications</h2>
        </div>

        <div className="p-4 space-y-3">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            New employee added
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;