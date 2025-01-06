import React, { ReactNode } from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  LineChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/use-auth';

const { Header, Sider, Content } = Layout;

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

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

  const routeMap: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/dashboard/realtime': 'realtime',
    '/dashboard/users': 'users',
  };

  const menuItems = [
    {
      key: 'realtime',
      icon: <LineChartOutlined />,
      label: 'Realtime',
      disabled: false,
      onClick: () => navigate('/dashboard/realtime'),
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
      disabled: false,
    },
  ];

  if (user?.role === 'admin') {
    menuItems.push({
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/dashboard/users'),
      disabled: false,
    });
  }

  const selectedKey = routeMap[location.pathname] || 'dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="p-4 text-white text-xl font-bold">Insight Engine</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white flex justify-between items-center px-6">
          <div />
          <Dropdown menu={userMenu} placement="bottomRight">
            <Button icon={<UserOutlined />}>
              {user?.name || user?.email || 'User'}
            </Button>
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
