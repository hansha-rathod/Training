// components/Navigation.jsx

import { Menu } from "antd"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { hasPermission } from "../utils/permissionUtils"

const Navigation = () => {
  const { role } = useSelector(state => state.auth)
  const permissions = role?.permissions

  return (
    <Menu mode="horizontal">
      {hasPermission(permissions, "users", "view") && (
        <Menu.Item key="users">
          <Link to="/users">Users</Link>
        </Menu.Item>
      )}

      {hasPermission(permissions, "employees", "view") && (
        <Menu.Item key="employees">
          <Link to="/employees">Employees</Link>
        </Menu.Item>
      )}

      {hasPermission(permissions, "projects", "view") && (
        <Menu.Item key="projects">
          <Link to="/projects">Projects</Link>
        </Menu.Item>
      )}

      {hasPermission(permissions, "roles", "view") && (
        <Menu.Item key="roles">
          <Link to="/roles">Roles & Permissions</Link>
        </Menu.Item>
      )}
    </Menu>
  )
}

export default Navigation