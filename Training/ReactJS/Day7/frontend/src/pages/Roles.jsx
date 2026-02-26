import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Drawer,
  Checkbox,
  Space,
  message,
  Card,
  Typography,
  Tag,
  Alert,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { roleService } from "../services/role.service";
import { selectUserRole } from "../features/auth/authSlice";
import { isAdmin } from "../utils/permissions";

const { Title } = Typography;

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    permissions: {
      users: [],
      employees: [],
      projects: [],
      roles: [],
    },
  });

  const userRole = useSelector(selectUserRole);
  const isCurrentUserAdmin = isAdmin(userRole);

  const availableModules = ["users", "employees", "projects", "roles"];
  const availableActions = ["view", "add", "edit", "delete"];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getAll();
      setRoles(data);
    } catch (err) {
      message.error(err.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    if (!isCurrentUserAdmin) {
      message.warning("Only Admin can modify role permissions");
      return;
    }
    setEditingRole(role);
    setFormData({
      name: role.name,
      permissions: { ...role.permissions },
    });
    setIsDrawerOpen(true);
  };

  const handleView = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      permissions: { ...role.permissions },
    });
    setIsDrawerOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingRole && isCurrentUserAdmin) {
        const updated = await roleService.update(editingRole.id, formData);
        setRoles(roles.map((r) => (r.id === editingRole.id ? updated : r)));
        message.success("Permissions updated successfully");
      }
      setIsDrawerOpen(false);
      setEditingRole(null);
    } catch (err) {
      message.error(err.message || "Failed to update permissions");
    }
  };

  const handlePermissionToggle = (module, action) => {
    const newPermissions = { ...formData.permissions };
    if (newPermissions[module].includes(action)) {
      newPermissions[module] = newPermissions[module].filter((a) => a !== action);
    } else {
      newPermissions[module] = [...newPermissions[module], action];
    }
    setFormData({ ...formData, permissions: newPermissions });
  };

  const getPermissionCount = (permissions) => {
    return Object.values(permissions).reduce((acc, actions) => acc + actions.length, 0);
  };

  const getPermissionTags = (permissions) => {
    return Object.entries(permissions).map(([module, actions]) => {
      const actionTags = actions.map((action) => (
        <Tag key={action} color="blue">
          {action}
        </Tag>
      ));
      return (
        <div key={module} style={{ marginBottom: 4 }}>
          <Tag color="purple">{module}</Tag>
          <Space size={4}>{actionTags}</Space>
        </div>
      );
    });
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space>
          <strong style={{ textTransform: "capitalize" }}>{name}</strong>
        </Space>
      ),
    },
    {
      title: "Users",
      key: "users",
      render: (_, record) => (
        <Tag color={record.permissions?.users?.length > 0 ? "green" : "default"}>
          {record.permissions?.users?.length || 0} permissions
        </Tag>
      ),
    },
    {
      title: "Employees",
      key: "employees",
      render: (_, record) => (
        <Tag color={record.permissions?.employees?.length > 0 ? "green" : "default"}>
          {record.permissions?.employees?.length || 0} permissions
        </Tag>
      ),
    },
    {
      title: "Projects",
      key: "projects",
      render: (_, record) => (
        <Tag color={record.permissions?.projects?.length > 0 ? "green" : "default"}>
          {record.permissions?.projects?.length || 0} permissions
        </Tag>
      ),
    },
    {
      title: "Roles",
      key: "roles",
      render: (_, record) => (
        <Tag color={record.permissions?.roles?.length > 0 ? "green" : "default"}>
          {record.permissions?.roles?.length || 0} permissions
        </Tag>
      ),
    },
    {
      title: "Total Permissions",
      key: "total",
      render: (_, record) => (
        <Tag color="blue">{getPermissionCount(record.permissions)}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          {isCurrentUserAdmin && record.name.toLowerCase() !== "admin" && (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const canEditPermissions = isCurrentUserAdmin && editingRole?.name.toLowerCase() !== "admin";

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>
          <SafetyOutlined /> Roles & Permissions
        </Title>
      </div>

      {!isCurrentUserAdmin && (
        <Alert
          message="View Only Mode"
          description="Only Admin can modify role permissions. You are in view-only mode."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Drawer
        title={
          canEditPermissions
            ? `Edit Permissions - ${formData.name}`
            : `Permissions - ${formData.name}`
        }
        placement="right"
        width={500}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setEditingRole(null);
        }}
        extra={
          canEditPermissions ? (
            <Space>
              <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit}>
                Update Permissions
              </Button>
            </Space>
          ) : null
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {availableModules.map((module) => (
            <Card key={module} size="small" title={<strong>{module.toUpperCase()}</strong>}>
              <Checkbox.Group
                value={formData.permissions[module] || []}
                onChange={(checkedValues) => {
                  if (canEditPermissions) {
                    setFormData({
                      ...formData,
                      permissions: {
                        ...formData.permissions,
                        [module]: checkedValues,
                      },
                    });
                  }
                }}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {availableActions.map((action) => (
                    <Checkbox
                      key={action}
                      value={action}
                      disabled={!canEditPermissions}
                    >
                      {action.charAt(0).toUpperCase() + action.slice(1)}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </Card>
          ))}
        </Space>
      </Drawer>
    </Card>
  );
};

export default Roles;
