import { useEmployees } from "../../context/EmployeeContext"

const EmployeeTable = ({ employees, onEdit }) => {
  const { deleteEmployee } = useEmployees()

  return (
    <div className="w-full bg-white border rounded-2xl text-left border-collapse">
      <table className="min-w-full text-sm">
        <thead className="border-b dark:border-gray-700">
          <tr className="border-b">
          <th className="py-3 px-4">ID</th>
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Department</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className="border-b dark:border-gray-700">
              <td className="py-3 px-4">{emp.id}</td>
            <td className="py-3 px-4">{emp.firstName} {emp.lastName}</td>
            <td className="py-3 px-4">{emp.department}</td>
            <td className="py-3 px-4">{emp.status}</td>
            <td className="py-3 px-4 flex items-center gap-4">
                <button onClick={() => onEdit(emp)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => deleteEmployee(emp.id)} className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable