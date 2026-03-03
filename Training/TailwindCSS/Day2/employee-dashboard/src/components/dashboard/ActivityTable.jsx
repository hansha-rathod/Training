const activities = [
  { id: 1, user: "Rahul", action: "Added new employee" },
  { id: 2, user: "Sneha", action: "Updated salary band" },
  { id: 3, user: "Amit", action: "Deleted employee record" },
]

const ActivityTable = () => {
  return (
    <div className="
      bg-white dark:bg-gray-800
      rounded-xl2
      p-6
      shadow-md
    ">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        Recent Activity
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="py-2 dark:text-white">User</th>
              <th className="py-2 dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item) => (
              <tr
                key={item.id}
                className="border-b dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="py-2">{item.user}</td>
                <td className="py-2">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ActivityTable