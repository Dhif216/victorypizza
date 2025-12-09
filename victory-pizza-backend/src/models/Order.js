const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    default: () => 'VP' + Math.random().toString(36).substr(2, 5).toUpperCase()
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryMethod: {
    type: String,
    enum: ['delivery', 'pickup'],
    required: true
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: String,
    city: String,
    notes: String
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: String,
    price: { type: Number, required: true },
    notes: String
  }],
  payment: {
    method: {
      type: String,
      enum: ['card', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  pricing: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  orderTime: String,
  estimatedTime: String,
  confirmed: { type: Boolean, default: false },
  confirmedAt: Date,
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date
  },
  rejectionReason: String,
  rejectedAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
