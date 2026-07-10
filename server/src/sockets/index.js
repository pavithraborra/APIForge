module.exports = (io) => {
  const onlineUsers = new Map(); // socketId -> userId

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // User authentication/registration with socket
    socket.on('register_user', (userId) => {
      onlineUsers.set(socket.id, userId);
      // Join a personal room for direct notifications
      socket.join(userId);
      console.log(`User ${userId} registered on socket ${socket.id}`);
      
      // Broadcast online status to others
      io.emit('user_online', { userId });
    });

    // Join a workspace room
    socket.on('join_workspace', (workspaceId) => {
      socket.join(workspaceId);
      console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
    });

    // Leave a workspace room
    socket.on('leave_workspace', (workspaceId) => {
      socket.leave(workspaceId);
      console.log(`Socket ${socket.id} left workspace ${workspaceId}`);
    });

    // Handle typing indicators
    socket.on('typing', ({ workspaceId, user, location }) => {
      socket.to(workspaceId).emit('user_typing', { user, location });
    });

    socket.on('stop_typing', ({ workspaceId, user }) => {
      socket.to(workspaceId).emit('user_stopped_typing', { user });
    });

    // Real-time collaboration cursor updates
    socket.on('cursor_move', ({ workspaceId, user, position }) => {
      socket.to(workspaceId).emit('cursor_update', { user, position });
    });

    // Disconnect
    socket.on('disconnect', () => {
      const userId = onlineUsers.get(socket.id);
      if (userId) {
        onlineUsers.delete(socket.id);
        io.emit('user_offline', { userId });
      }
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
