const mongoose = require('mongoose');
const Recipe = require('./Recipe');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  proteins: {
    type: Number,
  },
  carbs: {
    type: Number,
  },
  fats: {
    type: Number,
  },
  portion:{
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
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'recipe',
    required: 'This field is required.'
  },
  image: {
    type: String,
  },
  posted_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: 'This field is required.'
  }
});


module.exports = mongoose.model('meal', mealSchema);

