const express = require('express');
const { getProducts, getSingleProduct } = require('../controllers/productController');
const router = express.Router();
// Used to create separate routes
// for product-related operations
router.route('/products').get(getProducts);
router.route('/products/:id').get(getSingleProduct);
module.exports = router;