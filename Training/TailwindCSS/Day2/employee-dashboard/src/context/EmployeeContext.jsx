import { createContext, useContext, useEffect, useState } from "react"
import { initialEmployees } from "../utils/mockData"

const EmployeeContext = createContext()

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem("employees")
    if (stored) {
    const parsed = JSON.parse(stored)
    return parsed.length > 0 ? parsed : initialEmployees
    }
    return initialEmployees
  })

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees))
  }, [employees])

  const addEmployee = (employee) => {
    setEmployees(prev => [...prev, employee])
  }

  const updateEmployee = (updated) => {
    setEmployees(prev =>
      prev.map(emp => emp.id === updated.id ? updated : emp)
    )
  }

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id))
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  )
}

export const useEmployees = () => useContext(EmployeeContext)