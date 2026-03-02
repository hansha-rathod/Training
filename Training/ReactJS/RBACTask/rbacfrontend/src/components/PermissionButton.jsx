// components/PermissionButton.jsx

import { useSelector } from "react-redux"
import { hasPermission } from "../utils/permissionUtils"

const PermissionButton = ({ module, action, children }) => {
  const { role } = useSelector(state => state.auth)
  const allowed = hasPermission(role?.permissions, module, action)

  if (!allowed) return null

  return children
}

export default PermissionButton