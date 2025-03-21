const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: 'This field is required.'
  },
  recipes_count: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('category', categorySchema);