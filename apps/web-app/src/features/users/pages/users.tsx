import React, { useState } from 'react';
import { Button } from 'antd';
import { UserList } from '../components/user-list';
import { CreateUserModal } from '../components/create-user';

export function Users() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Create User
        </Button>
      </div>

      <UserList />

      <CreateUserModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}
