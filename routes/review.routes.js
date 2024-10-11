const express = require('express'),
router = express.Router(),
ReviewController =require('../controllers/review.controller');

router.post('/create', ReviewController.createReview)
router.get('/', ReviewController.showAllReviews)
router.get('/:id', ReviewController.showSingleReview)
router.get('/product/:productId', ReviewController.showByProductId)
router.put('/:id', ReviewController.updateReview)
router.delete('/:id', ReviewController.deleteReview)


module.exports = router;


