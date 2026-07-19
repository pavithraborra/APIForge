const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const { sanitizeBody } = require('./middleware/validate');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://api-forge-itut.vercel.app',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
