const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/mealsController');


router.post('/meal', recipeController.createMeal);
router.get('/meals', recipeController.getAllMeals);
router.get('/meal/:id', recipeController.getMealById);
router.put('/meal/:id', recipeController.updateMeal);
router.delete('/meal/:id', recipeController.deleteMeal);

 
module.exports = router;