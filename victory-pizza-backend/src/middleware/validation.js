const { body, param, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Order validation rules
const validateCreateOrder = [
  body('customer.name')
    .trim()
    .notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('customer.phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9+\s\-()]+$/).withMessage('Invalid phone number format'),
  
  body('customer.email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  
  body('customer.address')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Address too long'),
  
  body('customer.city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City name too long'),
  
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  
  body('items.*.name')
    .trim()
    .notEmpty().withMessage('Item name is required'),
  
  body('items.*.quantity')
    .isInt({ min: 1, max: 99 }).withMessage('Quantity must be between 1 and 99'),
  
  body('items.*.price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('pricing.subtotal')
    .isFloat({ min: 0 }).withMessage('Subtotal must be a positive number'),
  
  body('pricing.total')
    .isFloat({ min: 0 }).withMessage('Total must be a positive number'),
  
  body('payment.method')
    .isIn(['card', 'cash']).withMessage('Payment method must be card or cash'),
  
  body('deliveryMethod')
    .isIn(['delivery', 'pickup']).withMessage('Delivery method must be delivery or pickup'),
  
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Comment must not exceed 500 characters'),
  
  handleValidationErrors
];

// Order ID validation
const validateOrderId = [
  param('orderId')
    .trim()
    .matches(/^VP[A-Z0-9]{5}$/).withMessage('Invalid order ID format'),
  
  handleValidationErrors
];

// Status update validation
const validateStatusUpdate = [
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed'])
    .withMessage('Invalid status value'),
  
  handleValidationErrors
];

module.exports = {
  validateCreateOrder,
  validateReview,
  validateOrderId,
  validateStatusUpdate
};
