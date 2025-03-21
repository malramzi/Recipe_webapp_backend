const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  lunch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'meal',
    required: 'This field is required.'
  },
  breakfast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'meal',
    required: 'This field is required.'
  },
  dinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'meal',
    required: 'This field is required.'
  },
  snacks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'meal',
  },
  created_at: {
    type: Date,
    default: Date.now,
    // required: 'This field is required.'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: 'This field is required.'
  },
});


module.exports = mongoose.model('mealPlan', mealPlanSchema);

