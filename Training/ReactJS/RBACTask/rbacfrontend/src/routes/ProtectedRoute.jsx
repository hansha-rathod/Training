// routes/ProtectedRoute.jsx

import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { hasPermission } from "../utils/permissionUtils"

const ProtectedRoute = ({ children, module, action }) => {
  const { isAuthenticated, role } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (module && action) {
    const allowed = hasPermission(role?.permissions, module, action)
    if (!allowed) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return children
}

export default ProtectedRoute