import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu, Avatar, Typography, Dropdown, Space } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { logout, selectUser, selectUserPermissions } from "../features/auth/authSlice";
import { getNavigationItems } from "../utils/permissions";

const { Sider } = Layout;
const { Text } = Typography;

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userPermissions = useSelector(selectUserPermissions);

  const navItems = getNavigationItems(userPermissions);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    //injects allowed menu items
    ...navItems.map((item) => ({
      key: item.path,
      icon: item.icon,
      label: <Link to={item.path}>{item.label}</Link>,
    })),
  ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Sider
      width={250}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
      theme="dark"
    >
      <div style={styles.logoContainer}>
        <Link to="/dashboard" style={styles.brandLink}>
          <Space>
            <ThunderboltOutlined style={styles.brandIcon} />
            <span style={styles.brandText}>RBAC</span>
          </Space>
        </Link>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={styles.menu}
        items={menuItems}
        theme="dark"
      />

      <div style={styles.userInfo}>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="topLeft"
          trigger={["click"]}
        >
          <div style={styles.userDropdown}>
            <Avatar icon={<UserOutlined />} style={styles.avatar} />
            <div style={styles.userDetails}>
              <div style={styles.userName}>{user?.name}</div>
              <Text type="secondary" style={styles.userRole}>
                {user?.role}
              </Text>
            </div>
          </div>
        </Dropdown>
      </div>
    </Sider>
  );
};

const styles = {
  logoContainer: {
    padding: "20px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  brandLink: {
    color: "white",
    textDecoration: "none",
    display: "inline-block",
  },
  brandIcon: {
    fontSize: "24px",
    color: "#1890ff",
  },
  brandText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
  },
  menu: {
    borderRight: 0,
  },
  userInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  userDropdown: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  avatar: {
    backgroundColor: "#1890ff",
  },
  userDetails: {
    flex: 1,
    overflow: "hidden",
  },
  userName: {
    color: "white",
    fontSize: "14px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
    textTransform: "capitalize",
  },
};

export default Navigation;
