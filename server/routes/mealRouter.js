const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealsController');
const auth = require('../../middleware/auth')
const handleFileUpload  = require('../../middleware/handleFileUpload');


router.post('/meal', auth, handleFileUpload.single("image"), mealController.createMeal);
router.get('/meals', auth,mealController.getUserMeals);
router.get('/meal/:id',auth, mealController.getMealById);
router.put('/meal/:id', auth,handleFileUpload.single("image"), mealController.updateMeal);
router.delete('/meal/:id',auth, mealController.deleteMeal);

 
module.exports = router;