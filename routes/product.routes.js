const express = require('express'),
router = express.Router(),
ProductController =require('../controllers/product.controller');

router.get('/', ProductController.showAllProducts)
router.get('/:id', ProductController.showSingleProduct)
router.post('/create', ProductController.createProduct)
router.delete('/:id', ProductController.deleteProduct)
router.put('/:id', ProductController.updateProduct)



module.exports = router;






