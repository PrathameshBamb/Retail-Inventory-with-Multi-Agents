import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  if (!socket) return null;
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = (): Socket => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be within SocketProvider');
  return ctx;
};
