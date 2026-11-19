// Entry point for the backend server
// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

const app = express();

// Fail fast if required settings are missing
['MONGODB_URI', 'JWT_SECRET'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Global middleware
// CORS_ORIGIN: comma-separated allowed origins. Unset allows all (fine when
// the frontend is served by this same server).
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());         // parse JSON bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// serves images via /uploads/<filename>

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

// Health check route (good for testing)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lost', require('./routes/lostItemRoutes'));
app.use('/api/found', require('./routes/foundItemRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));



// Serve the frontend from the same server
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const PORT = process.env.PORT || 5000;

// If not in test, start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
