import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Modal, Form, Input, message } from "antd"
import PermissionButton from "../components/PermissionButton"
import {
  fetchProjects,
  addProject,
  updateProject,
  deleteProject
} from "../features/projects/projectSlice"

const Projects = () => {
  const dispatch = useDispatch()
  const { projects = [], loading, error } = useSelector(state => state.projects)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [error])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (editing) {
        dispatch(updateProject({ id: editing.id, data: values }))
        message.success("Project updated successfully")
      } else {
        dispatch(addProject(values))
        message.success("Project added successfully")
      }

      form.resetFields()
      setEditing(null)
      setOpen(false)
    } catch (err) {
      // Form validation failed
    }
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      onOk: () => {
        dispatch(deleteProject(id))
        message.success("Project deleted successfully")
      }
    })
  }

  const columns = [
    { title: "Project Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <PermissionButton module="projects" action="edit">
            <Button
              onClick={() => {
                setEditing(record)
                form.setFieldsValue(record)
                setOpen(true)
              }}
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
          </PermissionButton>

          <PermissionButton module="projects" action="delete">
            <Button danger onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          </PermissionButton>
        </>
      )
    }
  ]

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <PermissionButton module="projects" action="add">
          <Button type="primary" onClick={() => {
            setEditing(null)
            form.resetFields()
            setOpen(true)
          }}>
            Add Project
          </Button>
        </PermissionButton>
      </div>

      <Table
        rowKey="id"
        dataSource={projects}
        columns={columns}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit Project" : "Add Project"}
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
          setEditing(null)
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: "Please enter project name" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Projects