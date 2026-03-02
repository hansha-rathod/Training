import React from "react"
import { Card, Row, Col, Typography } from "antd"
import { useSelector } from "react-redux"
import { hasPermission } from "../utils/permissionUtils"

const { Title, Text } = Typography

const Dashboard = () => {
  const { user, role } = useSelector((state) => state.auth)

  const permissions = role?.permissions

  const modules = [
    { key: "users", title: "Users Management" },
    { key: "employees", title: "Employees Management" },
    { key: "projects", title: "Projects Management" },
    { key: "roles", title: "Roles & Permissions" },
  ]

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Welcome, {user?.name}</Title>
      <Text type="secondary">
        Role: <strong>{role?.name}</strong>
      </Text>

      <Row gutter={[16, 16]} style={{ marginTop: "24px" }}>
        {modules.map((module) =>
          hasPermission(permissions, module.key, "view") ? (
            <Col xs={24} sm={12} md={8} lg={6} key={module.key}>
              <Card
                title={module.title}
                bordered
                hoverable
              >
                You have access to manage {module.title}.
              </Card>
            </Col>
          ) : null
        )}
      </Row>
    </div>
  )
}

export default Dashboard