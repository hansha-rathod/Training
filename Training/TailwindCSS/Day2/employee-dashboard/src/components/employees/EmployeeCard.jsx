import { useEmployees } from "../../context/EmployeeContext"

const EmployeeCard = ({ employee, onEdit }) => {
  const { deleteEmployee } = useEmployees()

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl2 shadow-md">
      <h3 className="font-semibold dark:text-white">
        {employee.firstName} {employee.lastName}
      </h3>
      <p className="text-sm text-gray-500">{employee.department}</p>
      <p className="text-sm">{employee.status}</p>

      <div className="mt-3 flex justify-end space-x-3">
        <button onClick={() => onEdit(employee)} className="text-blue-500">Edit</button>
        <button onClick={() => deleteEmployee(employee.id)} className="text-red-500">Delete</button>
      </div>
    </div>
  )
}

export default EmployeeCard