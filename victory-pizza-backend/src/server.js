// Trigger redeploy for CORS update
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();


const app = express();

// CORS configuration - MUST be first middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3003',
    'http://localhost:3000',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:3007',
    'https://dhif216.github.io',
    'https://dhif216.github.io/victorypizza'
  ],
  credentials: true
}));

// Handle CORS preflight requests for all routes
app.options('*', cors());

// Trust proxy - required for Railway deployment
app.set('trust proxy', 1);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3003',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

// Security Middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: '10mb' })); // Limit payload size

// Apply rate limiters
app.use('/api/', apiLimiter);

// Make io accessible to routes
app.set('io', io);
app.set('authLimiter', authLimiter); // Make auth limiter available to routes

// Database connection
console.log('🔄 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🍕 Victory Pizza Backend API',
    version: '1.0.0',
    endpoints: {
      orders: '/api/orders',
      auth: '/api/auth',
      health: '/health'
    }
  });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('👤 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('👋 Client disconnected:', socket.id);
  });

  // Join dashboard room (for staff)
  socket.on('join-dashboard', () => {
    socket.join('dashboard');
    console.log('📊 Staff joined dashboard:', socket.id);
  });

  // Join order tracking room (for customers)
  socket.on('track-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`📦 Customer tracking order ${orderId}:`, socket.id);
  });
});

// Fallback CORS middleware (guarantees CORS headers for all responses)
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`\n📝 API Endpoints:`);
  console.log(`   - POST   /api/orders          (Create order)`);
  console.log(`   - GET    /api/orders/:id      (Track order)`);
  console.log(`   - GET    /api/orders          (All orders - auth required)`);
  console.log(`   - PATCH  /api/orders/:id/status (Update status - auth required)`);
  console.log(`   - POST   /api/auth/login      (Staff login)`);
  console.log(`   - GET    /health              (Health check)\n`);
});
