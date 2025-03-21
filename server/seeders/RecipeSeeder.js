const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const User = require('../models/User');
const recipes = require('../data/recipes.json');
const Ingredients = require('../models/Ingredients');

async function seedRecipes() {
  try {
    
    const categories = await Category.find({})
    const users = await User.find({})
    console.log(categories)
    recipes.map((recipe,idx) => {
        recipe["category"] = categories[idx%categories.length]._id
        recipe["posted_by"] = users[idx%users.length]._id
    })
    await Category.updateMany({}, { $inc: { recipes_count: 1 } });
    await Ingredients.insertMany(Array.from(new Set(recipes.flatMap(recipe => recipe.ingredients))).map(ingredient => ({ name: ingredient })));
    await Recipe.insertMany(recipes);
    console.log('20 recipes have been added to the database.');
  } catch (error) {
    console.error('Error seeding recipes:', error);
  } finally {
    mongoose.connection.close();
  }
}

mongoose.connect('mongodb://localhost:27017/recipeDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    seedRecipes();
  })
  .catch(err => console.error('Database connection error:', err));

