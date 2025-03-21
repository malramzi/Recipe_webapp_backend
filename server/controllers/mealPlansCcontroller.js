const MealPlan = require('../models/MealPlan');
const mealPlanSchemaJoi = Joi.object({
    lunch: Joi.string().hex().length(24),
    breakfast: Joi.string().hex().length(24),
    dinner: Joi.string().hex().length(24),
    snacks: Joi.array().items(Joi.string().objectId()),
    created_by: Joi.string().hex().length(24)
  });




// Create a new meal with validation
exports.createMeal = async (req, res) => {
  const { error } = mealPlanSchemaJoi.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const newMeal = new MealPlan(req.body);
    await newMeal.save();
    res.status(201).send(newMeal);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

// Get all meals
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await MealPlan.find().populate('lunch breakfast dinner snacks created_by'); 
    res.send(meals);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

// Get a specific mealPlan by ID with population
exports.getMealById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).populate('lunch breakfast dinner snacks created_by');
    if (!mealPlan) return res.status(404).send('MealPlan not found');
    res.send(mealPlan);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};

// Update a meal by ID with validation
exports.updateMeal = async (req, res) => {
  const { error } = mealPlanSchemaJoi.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedMeal = await MealPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMeal) return res.status(404).send('Meal not found');
    res.send(updatedMeal);
  } catch (ex) {
    res.status(400).send(ex.message);
  }
};

// Delete a meal by ID
exports.deleteMeal = async (req, res) => {
  try {
    const deletedMeal = await MealPlan.findByIdAndDelete(req.params.id);
    if (!deletedMeal) return res.status(404).send('Meal Plan not found');
    res.send(deletedMeal);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
};