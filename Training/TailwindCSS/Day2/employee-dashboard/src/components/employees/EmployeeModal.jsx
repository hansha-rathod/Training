import { useState, useEffect } from "react"
import { useEmployees } from "../../context/EmployeeContext"

const defaultFormState = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "IT",
  jobTitle: "",
  employmentType: "Full-time",
  reportingManager: "",
  workLocation: "",
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

        <div className="space-y-8">

  {/* ================= CORE IDENTITY ================= */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      Core Identity
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <label className="label-style">First Name</label>
        <input
          name="firstName"
          className="input-style"
          value={form.firstName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="label-style">Last Name</label>
        <input
          name="lastName"
          className="input-style"
          value={form.lastName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="label-style">Email Address</label>
        <input
          type="email"
          name="email"
          className="input-style"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="label-style">Phone Number</label>
        <input
          name="phone"
          className="input-style"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

    </div>
  </div>


  {/* ================= EMPLOYMENT DETAILS ================= */}
  <div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      Employment Details
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div>
        <label className="label-style">Department</label>
        <select
          name="department"
          className="input-style"
          value={form.department}
          onChange={handleChange}
        >
          <option>IT</option>
          <option>Design</option>
          <option>Finance</option>
          <option>Management</option>
        </select>
      </div>

      <div>
        <label className="label-style">Job Title</label>
        <select
          name="jobTitle"
          className="input-style"
          value={form.jobTitle}
          onChange={handleChange}
        >
          <option>Full-stack Developer</option>
          <option>UI/UX Designer</option>
          <option>Project Manager</option>
          <option>Accountant</option>
          
        </select>
      </div>

      <div>
        <label className="label-style">Employment Type</label>
        <select
          name="employmentType"
          className="input-style"
          value={form.employmentType}
          onChange={handleChange}
        >
          <option>Full-time</option>
          <option>Contract</option>
          <option>Intern</option>
        </select>
      </div>

      <div>
        <label className="label-style">Reporting Manager</label>
        <input
          name="reportingManager"
          className="input-style"
          value={form.reportingManager}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="label-style">Work Location</label>
        <select
          name="workLocation"
          className="input-style"
          value={form.workLocation}
          onChange={handleChange}
        >
          <option>On-site</option>
          <option>Remote</option>
        </select>
        
      </div>

      <div>
        <label className="label-style">Employment Status</label>
        <select
          name="status"
          className="input-style"
          value={form.status}
          onChange={handleChange}
        >
          <option>Active</option>
          <option>On Leave</option>
          <option>Probation</option>
          <option>Terminated</option>
        </select>
      </div>

    </div>
  </div>

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