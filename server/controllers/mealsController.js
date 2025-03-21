const Meal = require('../models/Meal');
const Joi = require("joi");

const mealSchemaJoi = Joi.object({
    name: Joi.string().required(),
    proteins: Joi.number().required(),
    carbs: Joi.number().required(),
    fats: Joi.number().required(),
    scale: Joi.string().valid('mg', 'g', 'kg').required(),
    calories: Joi.number().required(),
    description: Joi.string().required(),
    recipe: Joi.string().hex().length(24),
    image: Joi.string().uri().required()
  });

// Create a new meal
exports.createMeal = async (req, res) => {
  const { error } = mealSchemaJoi.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const meal = new Meal(req.body);
    await meal.save();
    res.status(201).send(meal);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

// Get all meals
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.send(meals);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

// Get a specific meal by ID
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).send('Meal not found');
    res.send(meal);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

// Update a meal by ID
exports.updateMeal = async (req, res) => {
  const { error } = mealSchemaJoi.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!meal) return res.status(404).send('Meal not found');
    res.send(meal);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

// Delete a meal by ID
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).send('Meal not found');
    res.send(meal);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};
