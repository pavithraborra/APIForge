import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { useWorkspace } from './WorkspaceContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('register_user', user._id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('user_online', ({ userId }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.add(userId);
          return newSet;
        });
      });

      newSocket.on('user_offline', ({ userId }) => {
        setOnlineUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  // Join workspace room when active workspace changes
  useEffect(() => {
    if (socket && isConnected && activeWorkspace) {
      socket.emit('join_workspace', activeWorkspace._id);

      return () => {
        socket.emit('leave_workspace', activeWorkspace._id);
      };
    }
  }, [socket, isConnected, activeWorkspace]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
