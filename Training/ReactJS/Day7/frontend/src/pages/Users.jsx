import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  message,
  Popconfirm,
  Card,
  Typography,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { userService } from "../services/user.service";
import { roleService } from "../services/role.service";
import { selectUserPermissions } from "../features/auth/authSlice";
import { canAdd, canEdit, canDelete } from "../utils/permissions";

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const userPermissions = useSelector(selectUserPermissions);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getAll(),
        roleService.getAll(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      message.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canAdd(userPermissions, "users")) {
      message.warning("You don't have permission to add users");
      return;
    }
    setEditingUser(null);
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const handleEdit = (user) => {
    if (!canEdit(userPermissions, "users")) {
      message.warning("You don't have permission to edit users");
      return;
    }
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!canDelete(userPermissions, "users")) {
      message.warning("You don't have permission to delete users");
      return;
    }

    try {
      await userService.delete(id);
      setUsers(users.filter((u) => u.id !== id));
      message.success("User deleted successfully");
    } catch (err) {
      message.error(err.message || "Failed to delete user");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        const updated = await userService.update(editingUser.id, {
          name: values.name,
          email: values.email,
          roleId: values.roleId,
        });
        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? { ...u, ...updated, roleName: roles.find((r) => r.id === values.roleId)?.name }
              : u
          )
        );
        message.success("User updated successfully");
      } else {
        const created = await userService.create(values);
        setUsers([
          ...users,
          { ...created, roleName: roles.find((r) => r.id === values.roleId)?.name },
        ]);
        message.success("User created successfully");
      }

      setIsDrawerOpen(false);
      form.resetFields();
    } catch (err) {
      if (err.errorFields) {
        message.error("Please fix the form errors");
      } else {
        message.error(err.message || "Operation failed");
      }
    }
  };

  const getRoleTag = (roleName) => {
    const roleColors = {
      Admin: "red",
      HR: "blue",
      Supervisor: "orange",
      Manager: "green",
    };
    return <Tag color={roleColors[roleName] || "default"}>{roleName}</Tag>;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Space>{text}</Space>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "roleName",
      key: "roleName",
      render: (roleName) => getRoleTag(roleName),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canEdit(userPermissions, "users") && (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
          {canDelete(userPermissions, "users") && (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>
          <UserOutlined /> Users Management
        </Title>
        {canAdd(userPermissions, "users") && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add User
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title={editingUser ? "Edit User" : "Add User"}
        placement="right"
        width={400}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          form.resetFields();
        }}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              {editingUser ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email address" disabled={!!editingUser} />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select
              placeholder="Select role"
              disabled={!!editingUser}
            >
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </Card>
  );
};

export default Users;
