const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../../middleware/auth');
const handleFileUpload = require('../../middleware/handleFileUpload');

router.post('/authSignup', userController.createUser);
router.post('/authLogin', userController.logInUser);
router.get('/users', auth,userController.getAllUsers);
router.patch('/user/',auth,handleFileUpload.single('image'), userController.updateUser);
router.patch('/user/changePassword',auth, userController.changePassword);
router.delete('/user/',auth, userController.deleteUser);
router.post('/user/saveRecipe', auth, userController.saveRecipe);
router.get('/user/getSavedRecipes', auth, userController.getSavedRecipes);
router.post('/user/likeRecipe', auth, userController.likeRecipe);
// router.get('/user/getLikedRecipes', auth, userController.getLikedRecipes);

module.exports = router;
