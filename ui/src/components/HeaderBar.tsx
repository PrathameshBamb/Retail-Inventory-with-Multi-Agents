import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useLocation, Link } from 'react-router-dom';

const { Header } = Layout;

const HeaderBar: React.FC = () => {
  const { pathname } = useLocation();

  // Define nav items
  const navItems = [
    { key: '/',           label: <Link to="/">Dashboard</Link> },
    { key: '/visualizer', label: <Link to="/visualizer">Visualizer</Link> },
    { key: '/alerts',     label: <Link to="/alerts">Alerts</Link> },
    { key: '/settings',   label: <Link to="/settings">Settings</Link> },
  ];

  // User dropdown menu items
  const userMenuItems = [
    { key: 'profile', label: 'Profile' },
    { key: 'logout',  label: 'Logout' },
  ];

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Logo/Brand */}
      <div style={{ flex: 1 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 32 }} />
      </div>

      {/* Navigation Tabs */}
      <Menu
        mode="horizontal"
        selectedKeys={[pathname]}
        items={navItems}
        style={{
          flex: 2,
          justifyContent: 'center',
          borderBottom: 'none',
        }}
      />

      {/* User Menu */}
      <Dropdown
        menu={{ items: userMenuItems }}
        trigger={['click']}
      >
        <Avatar
          icon={<UserOutlined />}
          style={{ cursor: 'pointer' }}
        />
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
