const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../../middleware/auth');

router.post('/category', auth, categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/user',auth, categoryController.getAllCategoriesByUser);
router.get('/category/:id', categoryController.getCategoryById);
router.put('/category/:id', auth, categoryController.updateCategory);
router.delete('/category/:id', auth, categoryController.deleteCategory);

module.exports = router;

