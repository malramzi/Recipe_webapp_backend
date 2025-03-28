const Meal = require('../models/Meal');
const Joi = require('joi');

const mealSchemaJoi = Joi.object({
    name: Joi.string().required(),
    proteins: Joi.number(),
    carbs: Joi.number(),
    fats: Joi.number(),
    portion: Joi.number().required(),
    scale: Joi.string().valid('mg', 'g', 'kg').required(),
    calories: Joi.number(),
    description: Joi.string().required(),
    recipe: Joi.string().hex().length(24),
    image: Joi.string(),
    posted_by: Joi.required(),
  });

// Create a new meal
exports.createMeal = async (req, res) => {
  const parsedData = {...req.body,posted_by:req.user._id}
  if(Object.keys(req.file).length > 0)
    parsedData.image = req.file.filename
  else 
    return res.status(400).json({ error: "Image is Required" });
  const { error } = mealSchemaJoi.validate(parsedData);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const meal = new Meal(parsedData);
    await meal.save();
    res.status(201).json(meal);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

// Get all meals
exports.getUserMeals = async (req, res) => {
  try {
    const meals = await Meal.find({posted_by:req.user._id});
    res.json(meals);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get a specific meal by ID
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json(meal);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Update a meal by ID
exports.updateMeal = async (req, res) => {
  try {
    const parsedData = {...req.body}
    if(req.file)
      parsedData.image = req.file.filename
    const meal = await Meal.findByIdAndUpdate(req.params.id, parsedData, {
      new: true
    });
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json(meal);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

// Delete a meal by ID
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).json({ error: 'Meal not found' });
    res.json(meal);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

