import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export const useAuthSync = () => {
  const dispatch = useDispatch();

  // Listen for logout from other tabs only
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Only handle logout from other tabs (when someone manually clicks logout)
      if (event.key === 'auth' && !event.newValue) {
        // Auth was cleared from another tab - logout this tab too
        dispatch(logout());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);
};

