import React, { ReactNode } from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  LineChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/use-auth';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const userMenu = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: logout,
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
          onClick={({ key }) => {
            if (key === 'users') {
              navigate('/dashboard/users');
            }
          }}
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
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
