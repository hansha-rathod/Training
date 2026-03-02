import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Modal, Form, Input, message } from "antd"
import PermissionButton from "../components/PermissionButton"
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser
} from "../features/users/userSlice"

const Users = () => {
  const dispatch = useDispatch()
  const { users = [], loading, error } = useSelector(state => state.users)

  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [error])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      // Add default password for new users
      if (!editingUser) {
        values.password = "password"
        values.roleId = 2 // Default to HR role
      }

      if (editingUser) {
        dispatch(updateUser({ id: editingUser.id, data: values }))
        message.success("User updated successfully")
      } else {
        dispatch(addUser(values))
        message.success("User added successfully")
      }

      setOpen(false)
      form.resetFields()
      setEditingUser(null)
    } catch (err) {
      // Form validation failed
    }
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      onOk: () => {
        dispatch(deleteUser(id))
        message.success("User deleted successfully")
      }
    })
  }

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <PermissionButton module="users" action="edit">
            <Button
              onClick={() => {
                setEditingUser(record)
                form.setFieldsValue(record)
                setOpen(true)
              }}
              style={{ marginRight: 8 }}
            >
              Edit
            </Button>
          </PermissionButton>

          <PermissionButton module="users" action="delete">
            <Button
              danger
              onClick={() => handleDelete(record.id)}
            >
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
        <PermissionButton module="users" action="add">
          <Button type="primary" onClick={() => {
            setEditingUser(null)
            form.resetFields()
            setOpen(true)
          }}>
            Add User
          </Button>
        </PermissionButton>
      </div>

      <Table
        rowKey="id"
        dataSource={users}
        columns={columns}
        loading={loading}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={open}
        onOk={handleSubmit}
        onCancel={() => {
          setOpen(false)
          form.resetFields()
          setEditingUser(null)
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter user name" />
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

          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password placeholder="Enter password (default: password)" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default Users