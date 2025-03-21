const mongoose = require('mongoose');
const User = require('../models/User');
const users = require('../data/users.json');

async function seedUsers() {
  try {
    await User.insertMany(users);
    console.log('2 users have been added to the database.');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
}

async function dropCollection(collectionName) {
  try {
    await mongoose.connection.collection(collectionName).drop()
    console.log(`${collectionName} collection dropped`);
  } catch (error) {
    console.error(`Error dropping ${collectionName} collection:`, error);
  }
}




mongoose.connect('mongodb://localhost:27017/recipeDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    dropCollection("recipeDB")
    seedUsers();
  })
  .catch(err => console.error('Database connection error:', err));

