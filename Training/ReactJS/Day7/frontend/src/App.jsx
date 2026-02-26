import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { ConfigProvider, theme } from "antd";
import { store } from "./app/store";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import Roles from "./pages/Roles";
import "./App.css";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Provider store={store}>
        <Router>
          <AppContent />
        </Router>
      </Provider>
    </ConfigProvider>
  );
}

function AppContent() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/roles" element={<Roles />} />
        </Route>
      </Route>

      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      <Route
        path="*"
        element={
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>404 - Page Not Found</h2>
            <p>Redirecting to login...</p>
          </div>
        }
      />
    </Routes>
  );
}

function MainLayout() {
  return (
    <div style={styles.app}>
      <Navigation />
      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    marginLeft: "250px",
    minHeight: "100vh",
  },
  content: {
    padding: "24px",
  },
};

export default App;
