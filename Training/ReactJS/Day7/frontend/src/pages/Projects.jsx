import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Drawer,
  Form,
  Input,
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
  ProjectOutlined,
} from "@ant-design/icons";
import { projectService } from "../services/project.service";
import { employeeService } from "../services/employee.service";
import { selectUserPermissions } from "../features/auth/authSlice";
import { canAdd, canEdit, canDelete } from "../utils/permissions";

const { Title } = Typography;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  const userPermissions = useSelector(selectUserPermissions);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, employeesData] = await Promise.all([
        projectService.getAll(),
        employeeService.getAll(),
      ]);
      setProjects(projectsData);
      setEmployees(employeesData);
    } catch (err) {
      message.error(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!canAdd(userPermissions, "projects")) {
      message.warning("You don't have permission to add projects");
      return;
    }
    setEditingProject(null);
    form.resetFields();
    form.setFieldsValue({ employeeIds: [] });
    setIsDrawerOpen(true);
  };

  const handleEdit = (project) => {
    if (!canEdit(userPermissions, "projects")) {
      message.warning("You don't have permission to edit projects");
      return;
    }
    setEditingProject(project);
    form.setFieldsValue({
      name: project.name,
      employeeIds: project.employeeIds || [],
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    if (!canDelete(userPermissions, "projects")) {
      message.warning("You don't have permission to delete projects");
      return;
    }

    try {
      await projectService.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
      message.success("Project deleted successfully");
    } catch (err) {
      message.error(err.message || "Failed to delete project");
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingProject) {
        const updated = await projectService.update(editingProject.id, values);
        setProjects(
          projects.map((p) => (p.id === editingProject.id ? updated : p))
        );
        message.success("Project updated successfully");
      } else {
        const created = await projectService.create(values);
        setProjects([...projects, created]);
        message.success("Project created successfully");
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

  const getEmployeeTags = (employeeIds) => {
    if (!employeeIds || employeeIds.length === 0) {
      return <Tag color="default">No Employees</Tag>;
    }

    return employeeIds.map((id) => {
      const employee = employees.find((e) => e.id === id);
      return employee ? (
        <Tag key={id} color="green">
          {employee.name}
        </Tag>
      ) : null;
    });
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <Space>{text}</Space>,
    },
    {
      title: "Assigned Employees",
      dataIndex: "employeeIds",
      key: "employeeIds",
      render: (employeeIds) => (
        <Space size="small" wrap>
          {getEmployeeTags(employeeIds)}
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canEdit(userPermissions, "projects") && (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              Edit
            </Button>
          )}
          {canDelete(userPermissions, "projects") && (
            <Popconfirm
              title="Delete Project"
              description="Are you sure you want to delete this project?"
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
          <ProjectOutlined /> Projects Management
        </Title>
        {canAdd(userPermissions, "projects") && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Project
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title={editingProject ? "Edit Project" : "Add Project"}
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
              {editingProject ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Project Name"
            name="name"
            rules={[
              { required: true, message: "Please enter project name" },
            ]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item label="Assign Employees" name="employeeIds">
            <Checkbox.Group style={{ width: "100%" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {employees.map((employee) => (
                  <Checkbox key={employee.id} value={employee.id}>
                    {employee.name} <Tag color="purple">{employee.designation}</Tag>
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

export default Projects;
