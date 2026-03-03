import { useState } from "react"
import { useSettings } from "../context/SettingsContext"
import { useEmployees } from "../context/EmployeeContext"

const Settings = () => {
  const { theme, toggleTheme, profile, updateProfile } = useSettings()
  const { employees } = useEmployees()

  const [form, setForm] = useState(profile)
  const [password, setPassword] = useState("")

  const handleProfileSave = () => {
    updateProfile(form)
    alert("Profile updated successfully!")
  }

  const handlePasswordChange = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }
    alert("Password changed successfully! (mock)")
    setPassword("")
  }

  const handleResetEmployees = () => {
    const confirmReset = window.confirm(
      "This will clear all employee data. Continue?"
    )
    if (confirmReset) {
      localStorage.removeItem("employees")
      window.location.reload()
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">

      <h1 className="text-2xl font-semibold dark:text-white">
        Settings
      </h1>

      {/* Theme Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-medium mb-4 dark:text-white">
          Appearance
        </h2>

        <button
          onClick={toggleTheme}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-medium dark:text-white">
          Profile
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
        />

        <button
          onClick={handleProfileSave}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Save Profile
        </button>
      </div>

      {/* Password Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-medium dark:text-white">
          Security
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:text-white"
        />

        <button
          onClick={handlePasswordChange}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          Change Password
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-medium text-red-600">
          Danger Zone
        </h2>

        <button
          onClick={handleResetEmployees}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Reset All Employees
        </button>

        <p className="text-sm text-gray-500">
          Current employees count: {employees.length}
        </p>
      </div>

    </div>
  )
}

export default Settings