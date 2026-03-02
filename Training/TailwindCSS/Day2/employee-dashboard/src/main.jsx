import { createRoot } from 'react-dom/client'
import './index.css'
import { EmployeeProvider } from "./context/EmployeeContext"
import App from "./App"

createRoot(document.getElementById("root")).render(
  <EmployeeProvider>
    <App />
  </EmployeeProvider>
)