import React, { useState } from 'react';
import { Switch, Input, Typography } from 'antd';

const { Title } = Typography;

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div style={{ padding: 16 }}>
      <Title level={2}>Settings</Title>

      <div style={{ marginBottom: 24 }}>
        <span style={{ marginRight: 8 }}>Dark Mode:</span>
        <Switch
          checked={darkMode}
          onChange={setDarkMode}
        />
      </div>

      <div>
        <span style={{ marginRight: 8 }}>Global Search:</span>
        <Input
          placeholder="Search for item or message…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
    </div>
  );
};

export default Settings;
