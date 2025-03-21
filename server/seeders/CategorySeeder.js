const mongoose = require('mongoose');
const Category = require('../models/Category');
const User = require('../models/User');
const categories = require('../data/categories.json');

async function seedCategories() {
  try {
    const users = await User.find({})
    categories.map((recipe,idx) => {
      recipe["posted_by"] = users[idx%users.length]._id
  })
    await Category.insertMany(categories);
    console.log('7 categories have been added to the database.');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    mongoose.connection.close();
  }
}

mongoose.connect('mongodb://localhost:27017/recipeDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    seedCategories();
  })
  .catch(err => console.error('Database connection error:', err));

