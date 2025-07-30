const express = require('express');
const { createOrder } = require('../controllers/orderController');
const router = express.Router();
// Import order controller
router.route('/order').post(createOrder);
module.exports = router;