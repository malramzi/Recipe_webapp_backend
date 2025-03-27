const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Recipe = require('../models/Recipe');
const bcrypt = require('bcryptjs')

const passwordSchema = {
  password: Joi.string().required(),
}
const passwordSchemaJoi = Joi.object(passwordSchema);

const userSchemaPartial = {
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number(),
  image: Joi.string(),
}
const userSchemaPartialJoi = Joi.object(userSchemaPartial);

const userSchemaJoi = Joi.object({...userSchemaPartial,...passwordSchema})



  
// Create a new user
exports.createUser = async (req, res) => {
  console.log(req.body)
  const { error } = userSchemaJoi.validate(req.body);
  if (error) return res.status(400).json({error: error.details[0].message});

  try {
    const user = new User(req.body);
    await user.save();
    const token = user.getJWTToken()
  

    res.status(201).json({success: true, user,token});
  } catch (ex) {
    res.status(400).json({error: ex.message});
  }
};


exports.logInUser = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(400).json({error: 'Please provide both email and password.'});
  }
  const user = await User.findOne({ email });
  console.log(user)
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({error: 'Invalid email or password.'});
  }

  const token = user.getJWTToken()

  res.json({success: true, token , user});
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({success: true, users});
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
};

// Get a specific user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({error: 'User not found'});
    res.json({success: true, user});
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { error } = userSchemaPartialJoi.validate(req.body);
  if (error) return res.status(400).send({error: error.details[0].message});

  try {
    const parsedData = {...req.body}
    if(req.file?.filename)
      parsedData.image = req.file.filename
    const updatedUser = await User.findByIdAndUpdate(req.user._id, parsedData , { new: true });
    if (!updatedUser) return res.status(404).json({error: 'User not found'});
    res.json({success: true, updatedUser});
  } catch (ex) {
    res.status(400).json({error: ex.message});
  }
};
// Save a recipe
exports.saveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({error: 'User not found'});
    console.log(req.body.id)
    const recipe = await Recipe.findById(req.body.id);
    if (!recipe) return res.status(404).json({error: 'Recipe not found'});
    if (user.saved_recipes.includes(recipe._id)) return res.status(400).json({error: 'Recipe already saved'});
    user.saved_recipes.push(recipe._id);
    await user.save();
    await recipe.update({ $inc: { saves: 1 } }, { new: true });
    res.json({success: true, user});
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
};

// Get saved recipes
exports.getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('saved_recipes');
    if (!user) return res.status(404).json({error: 'User not found'});
    const recipes = user.saved_recipes
    await Recipe.populate(recipes,'posted_by')
    res.json({success: true, savedRecipes: recipes});
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
};

// Like a recipe
exports.likeRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({error: 'User not found'});
    const recipe = await Recipe.findById(req.body.id);
    if (!recipe) return res.status(404).json({error: 'Recipe not found'});
    if (user.liked_recipes.includes(recipe._id)) return res.status(400).json({error: 'Recipe already liked'});
    user.liked_recipes.push(recipe._id);
    await user.save();
    await recipe.update({ $inc: { likes: 1 } }, { new: true });
    res.json({success: true, user});
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
};

// Change password for a user by ID
exports.changePassword = async (req, res) => {
  const { oPassword, nPassword } = req.body;
  try {
    console.log(req.body, req)
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({error: 'User not found'});
    const validPassword = await bcrypt.compare(oPassword, user.password);
    if (!validPassword) return res.status(400).json({error: 'Old password is incorrect'});
    if (nPassword === oPassword) return res.status(400).json({error: 'Existing Password.'});

    user.password = await bcrypt.hash(nPassword, 10);
    await user.save();
    const token = user.getJWTToken()
    res.locals.message = 'Password changed successfully';
    res.json({success: true, token});
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
};
// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) return res.status(404).json({error: 'User not found'});
    res.json({success: true, deletedUser});
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
};
