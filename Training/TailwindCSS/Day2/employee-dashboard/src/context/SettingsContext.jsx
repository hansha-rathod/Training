import { createContext, useContext, useEffect, useState } from "react"

const SettingsContext = createContext()

export const SettingsProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  )

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("profile")
    return stored
      ? JSON.parse(stored)
      : {
          name: "Admin User",
          email: "admin@example.com"
        }
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(profile))
  }, [profile])

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"))
  }

  const updateProfile = (updatedProfile) => {
    setProfile(updatedProfile)
  }

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        profile,
        updateProfile
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)