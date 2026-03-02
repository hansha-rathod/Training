import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Button, Modal, Checkbox, message } from "antd"
import { fetchRoles, updateRole } from "../features/roles/roleSlice"
import { canEditRolePermissions } from "../utils/permissionUtils"

const modules = ["users", "employees", "projects", "roles"]
const actions = ["view", "add", "edit", "delete"]

const Roles = () => {
  const dispatch = useDispatch()
  const { roles } = useSelector(state => state.roles)
  const { role: currentUserRole } = useSelector(state => state.auth)

  const [selectedRole, setSelectedRole] = useState(null)
  const [localPermissions, setLocalPermissions] = useState({})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  const handleEdit = (role) => {
    setSelectedRole(role)
    setLocalPermissions(role.permissions)
    setOpen(true)
  }

  const handleCheckboxChange = (module, action) => {
    const updated = { ...localPermissions }

    if (!updated[module]) updated[module] = []

    if (updated[module].includes(action)) {
      updated[module] = updated[module].filter(a => a !== action)
    } else {
      updated[module].push(action)
    }

    setLocalPermissions(updated)
  }

  const handleSave = async () => {
    try {
      await dispatch(updateRole({
        roleId: selectedRole.id,
        permissions: localPermissions,
        currentUserRole
      })).unwrap()

      message.success("Permissions updated successfully")
      setOpen(false)
    } catch (err) {
      message.error(err.message)
    }
  }

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name"
    },
    {
      title: "Action",
      render: (_, record) => {
        const editable = canEditRolePermissions(
          currentUserRole,
          record.id
        )

        return editable ? (
          <Button onClick={() => handleEdit(record)}>
            Edit Permissions
          </Button>
        ) : (
          <span style={{ color: "gray" }}>Locked</span>
        )
      }
    }
  ]

  return (
    <>
      <Table
        rowKey="id"
        dataSource={roles}
        columns={columns}
      />

      <Modal
        title={`Edit Permissions - ${selectedRole?.name}`}
        open={open}
        onOk={handleSave}
        onCancel={() => setOpen(false)}
      >
        {modules.map(module => (
          <div key={module} style={{ marginBottom: 16 }}>
            <strong>{module.toUpperCase()}</strong>
            <div style={{ display: "flex", gap: 20 }}>
              {actions.map(action => (
                <Checkbox
                  key={action}
                  checked={localPermissions[module]?.includes(action)}
                  onChange={() =>
                    handleCheckboxChange(module, action)
                  }
                >
                  {action}
                </Checkbox>
              ))}
            </div>
          </div>
        ))}
      </Modal>
    </>
  )
}

export default Roles