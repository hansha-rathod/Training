
import { Table, Button, Popconfirm, Tag, Space, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser } from '../redux/usersSlice';

const { Title, Text } = Typography;

const UserTable = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const getRoleColor = (role) => {
    const colors = {
      'Admin': 'red',
      'Manager': 'blue',
      'Developer': 'green',
      'Designer': 'purple',
      'Analyst': 'orange'
    };
    return colors[role] || 'default';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
      defaultSortOrder: 'ascend',
      render: (id) => <Text strong>#{id}</Text>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: '#52c41a' }} />
          <Text copyable>{email}</Text>
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'Admin' },
        { text: 'Manager', value: 'Manager' },
        { text: 'Developer', value: 'Developer' },
        { text: 'Designer', value: 'Designer' },
        { text: 'Analyst', value: 'Analyst' }
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={getRoleColor(role)}>{role}</Tag>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
      filters: [
        { text: 'Engineering', value: 'Engineering' },
        { text: 'Sales', value: 'Sales' },
        { text: 'Marketing', value: 'Marketing' },
        { text: 'Finance', value: 'Finance' }
      ],
      onFilter: (value, record) => record.department === value,
      render: (department) => <Tag color="cyan">{department}</Tag>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#1890ff' }}>
          User Directory
        </Title>
        <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
          Total Users: {users.length}
        </Text>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          // pagination={{
          //   pageSize: 10,
          //   showSizeChanger: true,
          //   showTotal: (total) => `Total ${total} users`,
          //   pageSizeOptions: ['5', '10', '20', '50']
          // }}
          scroll={{ x: 1000 }}
          bordered
          size="middle"
          rowSelection={{
            type: 'checkbox',
            columnWidth: 50
          }}
         
        />
      </div>
    </div>
  );
};

export default UserTable;
