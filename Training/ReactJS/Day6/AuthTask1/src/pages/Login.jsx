import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [name, setName] = useState('');
    const [role, setRole] = useState('User');

    const roles = ['User', 'Admin'];

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        const userData = {
            name,
            role,
        };

        dispatch(loginSuccess(userData));
    };

    return (
        <div style={{ padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <form onSubmit={handleLogin} style={{
                border: '1px solid #ddd',
                padding: 30,
                borderRadius: 8,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                maxWidth: 400,
                width: '100%'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Login</h2>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        style={{
                            width: '100%',
                            padding: 10,
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            fontSize: 14,
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div style={{ marginBottom: 30 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
                        Role
                    </label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                            width: '100%',
                            padding: 10,
                            border: '1px solid #ddd',
                            borderRadius: 4,
                            fontSize: 14,
                            boxSizing: 'border-box'
                        }}
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: 12,
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 16,
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login;