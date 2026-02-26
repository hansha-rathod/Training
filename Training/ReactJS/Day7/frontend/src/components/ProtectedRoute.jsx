import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserPermissions } from "../features/auth/authSlice";
import { canView } from "../utils/permissions";

const ProtectedRoute = ({ module, requiredPermission = "view" }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userPermissions = useSelector(selectUserPermissions);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (module && !canView(userPermissions, module)) {
    return (
      <div style={styles.unauthorized}>
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return <Outlet />;
};

const styles = {
  unauthorized: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    textAlign: "center",
  },
};

export default ProtectedRoute;
