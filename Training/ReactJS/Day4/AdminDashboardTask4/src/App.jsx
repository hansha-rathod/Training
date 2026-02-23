import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ThemeProvider from "./components/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;