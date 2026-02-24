import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ padding: 40 }}>
      <h2>Access Denied</h2>
      <p>You are not allowed to view this page.</p>

      <Link to="/dashboard">Go Back</Link>
    </div>
  );
};

export default Unauthorized;
