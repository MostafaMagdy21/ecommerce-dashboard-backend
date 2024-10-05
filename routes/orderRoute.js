const express=require('express'),
router = express.Router(),
orderController=require('../controllers/orderController');

router.post('/create', orderController.createOrder)
router.get('/cancel/:id', orderController.cancelOrder)
router.post('/update/:id', orderController.updateOrder)
router.get('/getSingle/:id', orderController.getSingleOrder)
router.get('/getAll', orderController.getAllOrders)
router.get('/filter', orderController.filterOrder)
router.get('/sort',orderController.sortByDate)



module.exports=router;