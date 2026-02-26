import { useSelector } from "react-redux";
import { Card, Typography, Row, Col, Tag, Space, Alert, Descriptions } from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  AppstoreOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { selectUser, selectUserPermissions } from "../features/auth/authSlice";
import { getNavigationItems, isAdmin } from "../utils/permissions";

const { Title, Text, Paragraph } = Typography;

const Dashboard = () => {
  const user = useSelector(selectUser);
  const userPermissions = useSelector(selectUserPermissions);

  const navItems = getNavigationItems(userPermissions);

  const getPermissionColor = (action) => {
    const colors = {
      view: "blue",
      add: "green",
      edit: "orange",
      delete: "red",
    };
    return colors[action] || "default";
  };

  const getModuleIcon = (module) => {
    const icons = {
      users: <UserOutlined />,
      employees: <UserOutlined />,
      projects: <AppstoreOutlined />,
      roles: <SafetyOutlined />,
    };
    return icons[module] || <AppstoreOutlined />;
  };

  return (
    <div style={styles.container}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Welcome Card */}
        <Card>
          <Space direction="vertical" size="small" style={{ width: "100%", textAlign: "center" }}>
            <Title level={2} style={{ margin: 0 }}>
              Welcome to RBAC System!
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              Logged in as <Text strong>{user?.name}</Text> with role{" "}
              <Tag color={isAdmin(user?.role) ? "red" : "blue"}>{user?.role}</Tag>
            </Paragraph>
          </Space>
        </Card>

        {/* Admin Notice */}
        {isAdmin(user?.role) && (
          <Alert
            message="Admin Privileges"
            description="You have Admin privileges. You can manage all modules and modify role permissions."
            type="warning"
            showIcon
            icon={<CrownOutlined />}
          />
        )}

        {/* User Profile */}
        <Card title={<Space><UserOutlined /> Your Profile</Space>}>
          <Descriptions column={{ xs: 1, sm: 2, md: 2 }}>
            <Descriptions.Item label="Name">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={isAdmin(user?.role) ? "red" : "blue"}>{user?.role}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="User ID">{user?.id}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Permissions */}
        <Card title={<Space><SafetyOutlined /> Your Permissions</Space>}>
          <Row gutter={[16, 16]}>
            {Object.entries(userPermissions || {}).map(([module, actions]) => (
              <Col xs={24} sm={12} md={8} key={module}>
                <Card size="small" style={styles.permissionCard}>
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <Space>
                      {getModuleIcon(module)}
                      <Text strong style={{ textTransform: "capitalize" }}>
                        {module}
                      </Text>
                    </Space>
                    <Space size="small" wrap>
                      {actions?.length > 0 ? (
                        actions.map((action) => (
                          <Tag key={action} color={getPermissionColor(action)}>
                            {action}
                          </Tag>
                        ))
                      ) : (
                        <Tag color="default">None</Tag>
                      )}
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Available Modules */}
        <Card title={<Space><AppstoreOutlined /> Available Modules</Space>}>
          {navItems.length > 0 ? (
            <Space size="middle" wrap>
              {navItems.map((item) => (
                <Tag key={item.path} icon={item.icon} style={styles.moduleTag}>
                  {item.label}
                </Tag>
              ))}
            </Space>
          ) : (
            <Text type="secondary">No modules available</Text>
          )}
        </Card>
      </Space>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
  },
  permissionCard: {
    backgroundColor: "#fafafa",
  },
  moduleTag: {
    padding: "8px 16px",
    fontSize: "14px",
    borderRadius: "4px",
  },
};

export default Dashboard;
