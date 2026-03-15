// Entry point - Express server configuration and startup
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
// - CORS: allows frontend to send cookies cross-origin
// - express.json: parses incoming JSON request bodies
// - cookieParser: parses cookies from request headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true  // Required for cookies to be sent cross-origin
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health check endpoint for deployment verification
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// Global error handler - must be registered after all routes
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});

app.get("/api", (req, res) => {
  res.send("Task Manager API working");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
