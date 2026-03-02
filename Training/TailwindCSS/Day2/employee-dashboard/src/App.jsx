import AppRoutes from "./routes/AppRoutes";
import { EmployeeProvider } from "./context/EmployeeContext"
import { SettingsProvider } from "./context/SettingsContext"

function App() {
  return <>
  <SettingsProvider>
    <EmployeeProvider>
     <AppRoutes />;
    </EmployeeProvider>
  </SettingsProvider>
  
 </>
  
}

export default App;