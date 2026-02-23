import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './UserSearchSlice';

import { Input, List, Card, Alert, Skeleton } from 'antd';

const { Search } = Input;

export default function UsersSearch() {
  const dispatch = useDispatch();

  const { users, status, error } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    dispatch(fetchUsers(''));
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(fetchUsers(value));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
   
      <Search
        placeholder="Search users by name..."
        enterButton
        size="large"
        onSearch={handleSearch}
        style={{ marginBottom: 24 }}
      />
   
      {status === 'failed' && (
        <Alert
          message="Error Fetching Users"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

   
      {status === 'loading' && (
        <>
          <Skeleton active paragraph={{ rows: 4 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </>
      )}

   
      {status === 'succeeded' && (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <Card title={user.name}>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Website:</strong> {user.website}</p>
              </Card>
            </List.Item>
          )}
        />
      )}

    </div>
  );
}