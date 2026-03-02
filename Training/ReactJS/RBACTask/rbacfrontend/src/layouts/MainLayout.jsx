import React from "react"
import { Layout, Button, Typography } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import { logout } from "../features/auth/authSlice"
import Navigation from "../components/Navigation"

const { Header, Content } = Layout
const { Text } = Typography

const MainLayout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, role } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      {/* Top Header */}
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#001529",
        }}
      >
        <div>
          <Text style={{ color: "#fff", fontSize: "16px" }}>
            RBAC System
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Text style={{ color: "#fff" }}>
            {user?.name} ({role?.name})
          </Text>
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Header>

      {/* Navigation Bar */}
      <Navigation />

      {/* Main Content */}
      <Content style={{ padding: "24px" }}>
        <Outlet />
      </Content>
    </Layout>
  )
}

export default MainLayout