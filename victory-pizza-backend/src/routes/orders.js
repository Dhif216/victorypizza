const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const {
  validateCreateOrder,
  validateReview,
  validateOrderId,
  validateStatusUpdate
} = require('../middleware/validation');

// Public routes (customer)
router.post('/', validateCreateOrder, orderController.createOrder);
router.get('/:orderId', validateOrderId, orderController.getOrder);
router.post('/:orderId/confirm', validateOrderId, orderController.confirmReceipt);
router.post('/:orderId/review', validateOrderId, validateReview, orderController.addReview);

// Protected routes (staff only)
router.get('/', auth, orderController.getAllOrders);
router.patch('/:orderId/status', auth, validateOrderId, validateStatusUpdate, orderController.updateStatus);
router.patch('/:orderId/cancel', auth, validateOrderId, orderController.cancelOrder);
router.delete('/:orderId', auth, validateOrderId, orderController.deleteOrder);
router.delete('/bulk/completed', auth, orderController.deleteCompletedOrders);

module.exports = router;
