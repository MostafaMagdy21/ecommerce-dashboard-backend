const express = require('express'),
router = express.Router(),
couponCodeController =require('../controllers/couponCode.controller');


router.post('/create', couponCodeController.createCoupon)
router.get('/:id', couponCodeController.getSingleCoupon)
router.get('/', couponCodeController.getAllCoupons)
router.delete('/:id', couponCodeController.deleteCoupon)
router.put('/:id', couponCodeController.updateCoupon)



module.exports = router;
