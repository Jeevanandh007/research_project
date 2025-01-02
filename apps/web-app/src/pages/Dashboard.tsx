import { useState } from 'react';
import { Layout, Menu, Dropdown, Button, Table, Modal, Form, Input, message } from 'antd';
import { UserOutlined, DashboardOutlined, LineChartOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { Header, Sider, Content } = Layout;

interface User {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserForm {
  email: string;
  password: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('http://localhost:3000/users', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

const createUser = async (data: CreateUserForm) => {
  const response = await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
};

const deleteUser = async (id: number) => {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
};

export function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalVisible(false);
      form.resetFields();
      message.success('User created successfully');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User deleted successfully');
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
          onClick={() => deleteUserMutation.mutate(record.id)}
          loading={deleteUserMutation.isPending}
        >
          Delete
        </Button>
      ),
    },
  ];

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="p-4 text-white text-xl font-bold">InsightEngine</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['users']}
          items={[
            {
              key: 'realtime',
              icon: <LineChartOutlined />,
              label: 'Realtime',
              disabled: true,
            },
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
              disabled: true,
            },
            {
              key: 'users',
              icon: <UserOutlined />,
              label: 'Users',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="bg-white flex justify-between items-center px-6">
          <div />
          <Dropdown menu={userMenu} placement="bottomRight">
            <Button icon={<UserOutlined />}>Admin</Button>
          </Dropdown>
        </Header>
        <Content className="m-6">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Users</h1>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                Create User
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={users}
              rowKey="id"
              loading={isLoading}
            />
          </div>
        </Content>
      </Layout>

      <Modal
        title="Create User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => createUserMutation.mutate(values)}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createUserMutation.isPending}
              block
            >
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default Dashboard; 