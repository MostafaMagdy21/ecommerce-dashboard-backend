const express = require("express"),
router = express.Router(),
CategoryController =require('../controllers/category.controller');

router.post('/', CategoryController.store);
router.get('/', CategoryController.index);
router.get('/:id',CategoryController.show);
router.put('/:id',CategoryController.update);
router.delete('/:id',CategoryController.destroy);

module.exports = router;
