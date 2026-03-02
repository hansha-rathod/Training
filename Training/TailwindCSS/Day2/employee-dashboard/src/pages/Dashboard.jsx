import { useEffect, useState, useMemo } from "react"
import KPICard from "../components/dashboard/KPICard"
import RevenueChart from "../components/dashboard/RevenueChart"
import ActivityTable from "../components/dashboard/ActivityTable"
import Skeleton from "../components/ui/Skeleton"
import { useEmployees } from "../context/EmployeeContext"

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const { employees } = useEmployees()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  /* -------------------------
     🔹 Derived Metrics
  --------------------------*/

  const totalEmployees = employees.length

  const activeEmployees = useMemo(() => {
    return employees.filter(emp => emp.status === "Active").length
  }, [employees])

  const itEmployees = useMemo(() => {
    return employees.filter(emp => emp.department === "IT").length
  }, [employees])

  const newHires = useMemo(() => {
    return employees.filter(emp => {
      if (!emp.doj) return false
      const joinDate = new Date(emp.doj)
      const today = new Date()
      const diffInDays = (today - joinDate) / (1000 * 60 * 60 * 24)
      return diffInDays <= 30
    }).length
  }, [employees])

  /* -------------------------
     🔹 Loading State
  --------------------------*/

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-xl2" />
        <Skeleton className="h-72 w-full rounded-xl2" />
        <Skeleton className="h-64 w-full rounded-xl2" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Section */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <KPICard 
            title="Total Employees" 
            value={totalEmployees} 
          />

          <KPICard 
            title="Active Employees" 
            value={activeEmployees} 
          />

          <KPICard 
            title="IT Employees" 
            value={itEmployees} 
          />

          <KPICard 
            title="New Hires (30 Days)" 
            value={newHires} 
          />

        </div>
      </section>

      {/* Revenue Chart */}
      <section>
        <RevenueChart />
      </section>

      {/* Activity Table */}
      <section>
        <ActivityTable />
      </section>

    </div>
  )
}

export default Dashboard