import React from 'react';
import { Table, Button } from 'antd';
import { User } from '../types';
import { useDeleteUser } from '../hooks/use-delete-user';
import { useGetUsers } from '../hooks/use-get-users';

export function UserList() {
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { users, isLoading } = useGetUsers();

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Button
          danger
          onClick={() => deleteUser(record.id)}
          loading={isDeleting}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={isLoading}
    />
  );
}
