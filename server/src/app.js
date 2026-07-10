const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { sanitizeBody } = require('./middleware/validate');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBody);

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'APIForge server is running' });
});

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/workspaces', require('./routes/workspaceRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/environments', require('./routes/environmentRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
