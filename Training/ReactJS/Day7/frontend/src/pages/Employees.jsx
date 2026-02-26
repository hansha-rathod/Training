import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
  Select,
  Checkbox,
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
import { employeeService } from "../services/employee.service";
import { projectService } from "../services/project.service";
import { selectUserPermissions } from "../features/auth/authSlice";
import { canAdd, canEdit, canDelete } from "../utils/permissions";

const { Title } = Typography;
const { Option } = Select;

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form] = Form.useForm();

  const userPermissions = useSelector(selectUserPermissions);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesData, projectsData] = await Promise.all([
        employeeService.getAll(),
        projectService.getAll(),
      ]);
      setEmployees(employeesData);
      setProjects(projectsData);
    } catch (err) {
      message.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canAdd(userPermissions, "employees")) {
      message.warning("You don't have permission to add employees");
      return;
    }
    setEditingEmployee(null);
    form.resetFields();
    form.setFieldsValue({ projectIds: [] });
    setIsDrawerOpen(true);
  };

  const handleEdit = (employee) => {
    if (!canEdit(userPermissions, "employees")) {
      message.warning("You don't have permission to edit employees");
      return;
    }
    setEditingEmployee(employee);
    form.setFieldsValue({
      name: employee.name,
      email: employee.email,
      designation: employee.designation,
      projectIds: employee.projectIds || [],
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!canDelete(userPermissions, "employees")) {
      message.warning("You don't have permission to delete employees");
      return;
    }

    try {
      await employeeService.delete(id);
      setEmployees(employees.filter((e) => e.id !== id));
      message.success("Employee deleted successfully");
    } catch (err) {
      message.error(err.message || "Failed to delete employee");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingEmployee) {
        const updated = await employeeService.update(
          editingEmployee.id,
          values
        );
        setEmployees(
          employees.map((e) => (e.id === editingEmployee.id ? updated : e))
        );
        message.success("Employee updated successfully");
      } else {
        const created = await employeeService.create(values);
        setEmployees([...employees, created]);
        message.success("Employee created successfully");
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

  const getProjectTags = (projectIds) => {
    if (!projectIds || projectIds.length === 0) {
      return <Tag color="default">No Projects</Tag>;
    }

    return projectIds.map((id) => {
      const project = projects.find((p) => p.id === id);
      return project ? (
        <Tag key={id} color="blue">
          {project.name}
        </Tag>
      ) : null;
    });
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
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Projects",
      dataIndex: "projectIds",
      key: "projectIds",
      render: (projectIds) => (
        <Space size="small" wrap>
          {getProjectTags(projectIds)}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canEdit(userPermissions, "employees") && (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
          {canDelete(userPermissions, "employees") && (
            <Popconfirm
              title="Delete Employee"
              description="Are you sure you want to delete this employee?"
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
          <UserOutlined /> Employees Management
        </Title>
        {canAdd(userPermissions, "employees") && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Employee
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
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
              {editingEmployee ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter employee name" }]}
          >
            <Input placeholder="Enter employee name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            rules={[
              { required: true, message: "Please enter designation" },
            ]}
          >
            <Input placeholder="Enter designation" />
          </Form.Item>

          <Form.Item label="Projects" name="projectIds">
            <Checkbox.Group style={{ width: "100%" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {projects.map((project) => (
                  <Checkbox key={project.id} value={project.id}>
                    {project.name}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Drawer>
    </Card>
  );
};

export default Employees;
