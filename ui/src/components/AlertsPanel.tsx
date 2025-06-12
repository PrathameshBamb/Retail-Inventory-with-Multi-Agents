import React, { useEffect, useState } from 'react';
import { List, Badge, Button } from 'antd';
import { useSocket } from '../contexts/SocketContext';

type Alert = { text: string; time: string };

const AlertsPanel: React.FC = () => {
  const socket = useSocket();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Listen for all agent events
    const handler = (evt: any) => {
      if (evt.type === 'ALERT_SENT') {
        // evt.payload is already an object
        const alertText = (evt.payload as any).alert;
        const newAlert: Alert = {
          text: alertText,
          time: new Date().toLocaleTimeString(),
        };
        setAlerts(current => [newAlert, ...current]);
      }
    };

    socket.on('agent_event', handler);
    return () => { socket.off('agent_event', handler); };
  }, [socket]);

  return (
    <div>
      <h2>Active Alerts</h2>
      <List
        dataSource={alerts}
        locale={{ emptyText: 'No active alerts' }}
        renderItem={(a, idx) => (
          <List.Item
            key={idx}
            actions={[
              <Button
                type="link"
                onClick={() => setAlerts(current => current.filter((_, i) => i !== idx))}
              >
                Acknowledge
              </Button>
            ]}
          >
            <Badge status="error" />
            <span style={{ margin: '0 8px', fontSize: 12 }}>{a.time}</span>
            <span>{a.text}</span>
          </List.Item>
        )}
      />
    </div>
  );
};

export default AlertsPanel;
