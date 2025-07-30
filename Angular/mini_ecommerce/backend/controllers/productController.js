const productModel = require('../models/productModels');
exports.getProducts =async (req, res, next) => {
  // Logic to fetch products from the database
  const product = await productModel.find({})
    res.json({
        success: true,
        product    
        
});
};

exports.getSingleProduct = (req, res, next) => {
  // Logic to fetch products from the database
    res.json({
        success: true,
        message: "single Product fetched successfully",

});
};

