const Order = require('../models/Order');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    // Always remove orderId from incoming data to force schema default
    if ('orderId' in req.body) {
      delete req.body.orderId;
    }
    const order = new Order(req.body);
    await order.save();

    // Emit real-time notification to dashboard (Socket.IO)
    const io = req.app.get('io');
    if (io) {
      io.emit('new-order', order);
    }

    res.status(201).json({
      success: true,
      orderId: order.orderId,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get order by ID (for tracking)
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (dashboard)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    const filter = status ? { status } : {};
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('order-updated', order);
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Customer confirms receipt
exports.confirmReceipt = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { 
        confirmed: true,
        confirmedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { 
        review: {
          rating,
          comment,
          submittedAt: new Date()
        }
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    const updateData = { 
      status: 'cancelled',
      rejectedAt: new Date()
    };
    
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('order-updated', order);
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete order (permanent deletion)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully',
      deletedOrder: order.orderId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Bulk delete completed orders
exports.deleteCompletedOrders = async (req, res) => {
  try {
    const result = await Order.deleteMany({ status: 'completed' });

    // Emit real-time update to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('orders-deleted', { count: result.deletedCount, status: 'completed' });
    }

    res.json({
      success: true,
      message: `${result.deletedCount} completed orders deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

