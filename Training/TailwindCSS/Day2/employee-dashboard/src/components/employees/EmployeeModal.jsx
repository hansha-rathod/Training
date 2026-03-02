import { useState, useEffect } from "react"
import { useEmployees } from "../../context/EmployeeContext"

const defaultFormState = {
  id: "",
  firstName: "",
  lastName: "",
  department: "IT",
  status: "Active"
}

const EmployeeModal = ({ isOpen, onClose, employee }) => {
  const { addEmployee, updateEmployee } = useEmployees()

  const [form, setForm] = useState(defaultFormState)

  /* -----------------------
     Sync form when editing
  ------------------------*/
  useEffect(() => {
    if (employee) {
      setForm(employee)
    } else {
      setForm(defaultFormState)
    }
  }, [employee, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.department) {
      alert("Please fill all required fields")
      return
    }

    if (employee) {
      updateEmployee(form)
    } else {
      addEmployee({
        ...form,
        id: `EMP-${Date.now()}`
      })
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl2 p-6 w-full max-w-xl shadow-xl">

        <h2 className="text-xl font-semibold mb-6 dark:text-white">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* First Name */}
          <input
            name="firstName"
            placeholder="First Name"
            className="border dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            value={form.firstName}
            onChange={handleChange}
          />

          {/* Last Name */}
          <input
            name="lastName"
            placeholder="Last Name"
            className="border dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            value={form.lastName}
            onChange={handleChange}
          />

          {/* Department */}
          
          <select
            name="department"
            className="border dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            value={form.department}
            onChange={handleChange}
          >
            <option value="IT">IT</option>
            <option value="Design">Design</option>
            <option value="Finance">Finance</option>
            <option value="Management">Management</option>
          </select>


          {/* Status Dropdown */}
          <select
            name="status"
            className="border dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Probation">Probation</option>
            <option value="Terminated">Terminated</option>
          </select>

        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border dark:border-gray-600"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded-xl2 hover:opacity-90 transition"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  )
}

export default EmployeeModal