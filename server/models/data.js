const mongoose = require('mongoose');
const User = require('./User');
const Recipe = require('./Recipe');
const Meal = require('./Meal');
const MealPlan = require('./MealPlan');

const users = [
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    first_name: 'Jane',
    last_name: 'Doe',
    email: 'jane.doe@example.com',
    phone: '0987654321',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  }
];

const recipes = require('../data/recipes.json');

const meals = [
  {
    name: 'Breakfast',
    proteins: 30,
    carbs: 40,
    fats: 20,
    scale: 'g',
    calories: 250,
    description: 'Scrambled eggs with spinach and feta cheese',
    recipe: recipes[0]._id,
    image: 'breakfast.jpg'
  },
  {
    name: 'Lunch',
    proteins: 50,
    carbs: 60,
    fats: 30,
    scale: 'g',
    calories: 400,
    description: 'Grilled chicken breast with quinoa and roasted vegetables',
    recipe: recipes[1]._id,
    image: 'lunch.jpg'
  },
  {
    name: 'Dinner',
    proteins: 70,
    carbs: 80,
    fats: 40,
    scale: 'g',
    calories: 550,
    description: 'Baked salmon with sweet potato and green beans',
    recipe: recipes[0]._id,
    image: 'dinner.jpg'
  },
  {
    name: 'Snack',
    proteins: 20,
    carbs: 30,
    fats: 10,
    scale: 'g',
    calories: 150,
    description: 'Apple slices with almond butter',
    recipe: recipes[1]._id,
    image: 'snack.jpg'
  }
];

const mealPlans = [
  {
    lunch: meals[1]._id,
    breakfast: meals[0]._id,
    dinner: meals[2]._id,
    snacks: [meals[3]._id],
    created_by: users[0]._id
  }
];

Promise.all([
  User.insertMany(users),
  Recipe.insertMany(recipes),
  Meal.insertMany(meals),
  MealPlan.insertMany(mealPlans)
]).then(() => {
  console.log('Dummy data created');
  mongoose.connection.close();
});
