import { useState } from "react";
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Avatar,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} className="user-avatar" />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
              {record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span className={`user-status ${status.toLowerCase()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Last Active",
      dataIndex: "lastActive",
      key: "lastActive",
      render: (date) => (
        <span style={{ color: "var(--text-secondary)" }}>{date}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space size="small" className="user-actions">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Dropdown
            menu={{
              items: [
                { key: "1", label: "View Details", icon: <EyeOutlined /> },
                { key: "2", label: "Edit", icon: <EditOutlined /> },
                { key: "3", label: "Delete", icon: <DeleteOutlined />, danger: true },
              ],
            }}
            trigger={["click"]}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const userData = [
    {
      key: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "Admin",
      status: "Active",
      lastActive: "2 minutes ago",
    },
    {
      key: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
      role: "User",
      status: "Active",
      lastActive: "1 hour ago",
    },
    {
      key: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
      role: "User",
      status: "Inactive",
      lastActive: "3 days ago",
    },
    {
      key: "4",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      avatar: "https://i.pravatar.cc/150?img=4",
      role: "Editor",
      status: "Pending",
      lastActive: "1 week ago",
    },
    {
      key: "5",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      avatar: "https://i.pravatar.cc/150?img=5",
      role: "User",
      status: "Active",
      lastActive: "5 hours ago",
    },
  ];

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>Users</h1>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Add User
        </Button>
      </div>

      <Card className="users-table-container">
        <div className="users-filter">
          <Search
            placeholder="Search users..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            size="large"
            style={{ minWidth: 150 }}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "pending", label: "Pending" },
            ]}
          />
          <Button icon={<FilterOutlined />} size="large">
            More Filters
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={userData}
          pagination={{
            total: userData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} users`,
          }}
        />
      </Card>
    </div>
  );
};

export default Users;