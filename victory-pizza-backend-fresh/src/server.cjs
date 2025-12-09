require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


// CORS middleware (allow frontend domain)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://dhif216.github.io',
    'https://dhif216.github.io/victorypizza'
  ],
  credentials: true
}));

// Global OPTIONS handler for CORS preflight
app.options('*', cors());

app.use(express.json());

// Auth route
const authRouter = require('./routes/auth.cjs');
app.use('/api/auth', authRouter);


// Orders route
const ordersRouter = require('./routes/orders.cjs');
app.use('/api/orders', ordersRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err.message));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
