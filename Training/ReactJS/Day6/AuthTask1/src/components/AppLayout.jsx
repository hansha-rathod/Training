import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Outlet, Link } from 'react-router-dom';

const AppLayout = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    // Just dispatch logout - redux-persist will handle localStorage cleanup
    dispatch(logout());
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <nav>
          <Link to="/dashboard">Dashboard</Link>

          {user?.role === 'Admin' && (
            <Link to="/admin" style={{ marginLeft: 10 }}>
              Admin
            </Link>
          )}

          <Link to="/profile" style={{ marginLeft: 10 }}>
            Profile
          </Link>
        </nav>

        <div>
          {user?.name} ({user?.role})
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
