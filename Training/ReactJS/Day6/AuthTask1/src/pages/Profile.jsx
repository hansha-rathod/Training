import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSelectors';

const Profile = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user?.name}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default Profile;
