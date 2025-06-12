import React, { useEffect, useState } from 'react';
import { List, Badge } from 'antd';
import { useSocket } from '../contexts/SocketContext';

type Event = { type:string; payload:any; time:string };

const EventFeed: React.FC = () => {
  const socket = useSocket();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    socket.on('agent_event', evt => {
      setEvents(e => [{ ...evt, time: new Date().toLocaleTimeString() }, ...e].slice(0,100));
    });
    return () => { socket.off('agent_event'); };
  }, [socket]);

  const colorMap:any = {
    REQUEST_STOCK: 'blue', FORECAST: 'green', ALERT_SENT: 'red'
  };

  return (
    <List
      header={<div>Event Feed</div>}
      dataSource={events}
      renderItem={e => (
        <List.Item>
          <Badge color={colorMap[e.type]||'gray'} />
          <span style={{ margin:'0 8px', fontSize:12 }}>{e.time}</span>
          <span style={{ fontWeight:600 }}>{e.type}</span>
        </List.Item>
      )}
      style={{ maxHeight: 300, overflowY: 'auto' }}
    />
  );
};

export default EventFeed;
