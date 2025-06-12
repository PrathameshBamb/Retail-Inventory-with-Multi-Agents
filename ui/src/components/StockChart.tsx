import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Brush } from 'recharts';
import { useSocket } from '../contexts/SocketContext';

type DataPoint = { time:string; stock:number };

const initial:DataPoint[] = [];

const StockChart: React.FC = () => {
  const socket = useSocket();
  const [data, setData] = useState<DataPoint[]>(initial);

  useEffect(() => {
    socket.on('agent_event', evt => {
      if(evt.type==='WAREHOUSE_SUPPLIED'){
        const now = new Date().toLocaleTimeString();
        const qty = parseInt(JSON.parse(evt.payload).body.split('qty=')[1]);
        setData(d => [...d, { time: now, stock: qty }].slice(-50));
      }
    });
    return () => { socket.off('agent_event'); };
  }, [socket]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 'dataMax+20']} />
        <Tooltip />
        <Line type="monotone" dataKey="stock" stroke="#8884d8" dot={false} />
        <Brush dataKey="time" height={30} stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
