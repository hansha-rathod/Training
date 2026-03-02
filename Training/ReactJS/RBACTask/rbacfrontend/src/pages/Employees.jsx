import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Modal, Form, Input, message } from "antd"
import PermissionButton from "../components/PermissionButton"
import {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from "../features/employees/employeeSlice"

const Employees = () => {
  const dispatch = useDispatch()
  const { employees = [], loading, error } = useSelector(state => state.employees)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch(fetchEmployees())
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
        dispatch(updateEmployee({ id: editing.id, data: values }))
        message.success("Employee updated successfully")
      } else {
        dispatch(addEmployee(values))
        message.success("Employee added successfully")
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
      title: "Are you sure you want to delete this employee?",
      onOk: () => {
        dispatch(deleteEmployee(id))
        message.success("Employee deleted successfully")
      }
    })
  }

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Designation", dataIndex: "designation", key: "designation" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <PermissionButton module="employees" action="edit">
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

          <PermissionButton module="employees" action="delete">
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
        <PermissionButton module="employees" action="add">
          <Button type="primary" onClick={() => {
            setEditing(null)
            form.resetFields()
            setOpen(true)
          }}>
            Add Employee
          </Button>
        </PermissionButton>
      </div>

      <Table
        rowKey="id"
        dataSource={employees}
        columns={columns}
        loading={loading}
      />

      <Modal
        title={editing ? "Edit Employee" : "Add Employee"}
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
            label="Name"
            rules={[{ required: true, message: "Please enter employee name" }]}
          >
            <Input placeholder="Enter employee name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter valid email" }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true, message: "Please enter designation" }]}
          >
            <Input placeholder="Enter designation" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Employees