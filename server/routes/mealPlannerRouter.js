const express = require('express');
const router = express.Router();
const mealPlannerController = require('../controllers/mealPlansController');


router.post('/mealPlan', mealPlannerController.createMealPlan);
router.get('/mealPlans', mealPlannerController.getAllMealPlans);
router.get('/mealPlan/:id', mealPlannerController.getMealPlanById);
router.put('/mealPlan/:id', mealPlannerController.updateMealPlan);
router.delete('/mealPlan/:id', mealPlannerController.deleteMealPlan);

 
module.exports = router;