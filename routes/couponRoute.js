const express = require('express'),
router = express.Router(),
couponCodeController =require('../controllers/couponCodeController');


router.post('/create', couponCodeController.createCoupon)
router.get('/getSingle/:id', couponCodeController.getSingleCoupon)
router.get('/getAll', couponCodeController.getAllCoupons)
router.get('/delete/:id', couponCodeController.deleteCoupon)
router.post('/update/:id', couponCodeController.updateCoupon)



module.exports = router;
