const mongoose = require('mongoose');
const Recipe = require('./Recipe');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  proteins: {
    type: Number,
    required: 'This field is required.'
  },
  carbs: {
    type: Number,
    required: 'This field is required.'
  },
  fats: {
    type: Number,
    required: 'This field is required.'
  },
  scale:{
    type: String,
    enum: ['mg', 'g', 'kg'],
    required: 'This field is required.'
  },
  calories: {
    type: Number,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recipe',
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});


module.exports = mongoose.model('meal', mealSchema);

