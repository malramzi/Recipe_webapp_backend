const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipesController');
const auth = require('../../middleware/auth')
const handleFileUpload  = require('../../middleware/handleFileUpload');


router.post('/recipes', auth,handleFileUpload.single('image'), recipeController.createRecipe);
router.post('/recipe/make', recipeController.findClosestRecipe);
router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipe/:id', recipeController.getRecipeById);
router.put('/recipe/:id',auth,handleFileUpload.single('image'), recipeController.updateRecipe);
router.delete('/recipe/:id',auth, recipeController.deleteRecipe);
router.get('/recipes/user-recipes', auth, recipeController.getUserRecipes);
router.get('/ingredients', recipeController.getAllIngredients);
 
module.exports = router;