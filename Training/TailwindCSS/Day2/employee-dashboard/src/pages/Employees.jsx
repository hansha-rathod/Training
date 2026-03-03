import { useState, useEffect } from "react"
import { useEmployees } from "../context/EmployeeContext"
import EmployeeTable from "../components/employees/EmployeeTable"
import EmployeeCard from "../components/employees/EmployeeCard"
import EmployeeModal from "../components/employees/EmployeeModal"
import Skeleton from "../components/ui/Skeleton"

const Employees = () => {
  const { employees } = useEmployees()
  const [loading, setLoading] = useState(true)

  const [isOpen, setIsOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 1500)
  
      return () => clearTimeout(timer)
    }, [])

  /* ---------------------------
     Modal Handlers
  ----------------------------*/

  const handleAddEmployee = () => {
    setEditingEmployee(null) // Important → clear previous edit state
    setIsOpen(true)
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditingEmployee(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full rounded-xl2" />
        <Skeleton className="h-12 w-full rounded-xl2" />
        <Skeleton className="h-12 w-full rounded-xl2" />
        <Skeleton className="h-12 w-full rounded-xl2" />
        <Skeleton className="h-12 w-full rounded-xl2" />
      </div>
    )
  }
  

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold dark:text-white">
          Employees
        </h1>

        <button
          onClick={handleAddEmployee}
          className="bg-primary hover:opacity-90 transition text-white px-4 py-2 rounded-xl2 shadow-md"
        >
          Add Employee
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <EmployeeTable
          employees={employees}
          onEdit={handleEditEmployee}
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {employees.map(emp => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            onEdit={handleEditEmployee}
          />
        ))}
      </div>

      {/* Modal */}
      <EmployeeModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        employee={editingEmployee}
      />
    </div>
  )
}

export default Employees