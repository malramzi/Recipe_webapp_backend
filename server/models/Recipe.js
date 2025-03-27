const mongoose = require('mongoose');
const Ingredients = require('./Ingredients');
const Category = require('./Category');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // required: 'This field is required.'
  },
  likes: {
    type: Number,
  },
  saves: {
    type: Number,
  },
  cook_time: {
    type: String,
    required: 'This field is required.'
  }, 
  ingredients: {
    type: Array,
    required: 'This field is required.'
  },
  procedures:{ 
    type: Array,
    required: 'This field is required.'
    },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

recipeSchema.pre('save', async function (next) {
  console.log(this)
  const recipe = this;
  const ingredients = recipe.ingredients;
  const category = await Category.findById(recipe.category)
  const existingIngredients = await Ingredients.find({ name: { $in: ingredients } });
  const newIngredients = ingredients.filter(ingredient => !existingIngredients.some(item => item.name === ingredient));
  const promises = newIngredients.map(ingredient => {
    const newIngredient = new Ingredients({ name: ingredient });
    return newIngredient.save();
  });
  const savedIngredients = await Promise.all(promises);
  recipe.ingredients = existingIngredients.map(item => item._id).concat(savedIngredients.map(item => item._id));
  await category.updateOne({ $inc: { recipe_count: 1 } });
  next();
});


recipeSchema.index({ name: 'text', description: 'text' });
// WildCard Indexing
//recipeSchema.index({ "$**" : 'text' });

module.exports = mongoose.model('recipe', recipeSchema);