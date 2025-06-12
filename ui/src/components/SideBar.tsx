import React, { useState, useEffect } from 'react';
import { Layout, Menu, Badge } from 'antd';
import { useSocket } from '../contexts/SocketContext';

const { Sider } = Layout;
const agents = ['store', 'warehouse', 'supplier', 'customer'];

const SideBar: React.FC = () => {
  const socket = useSocket(); // you can use this to update real statuses
  const [status, setStatus] = useState<Record<string, 'online' | 'offline'>>(
    agents.reduce((acc, name) => ({ ...acc, [name]: 'offline' }), {})
  );

  useEffect(() => {
    // Example: mark all agents online once socket connects
    socket.on('connect', () => {
      setStatus(agents.reduce((acc, name) => ({ ...acc, [name]: 'online' }), {}));
    });
    return () => {
      socket.off('connect');
    };
  }, [socket]);

  const menuItems = agents.map(name => ({
    key: name,
    label: (
      <Badge
        status={status[name] === 'online' ? 'success' : 'warning'}
        text={name.charAt(0).toUpperCase() + name.slice(1)}
      />
    ),
  }));

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        items={menuItems}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  );
};

export default SideBar;
