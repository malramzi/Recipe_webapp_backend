const MealPlan = require('../models/MealPlan');
const Joi = require('joi');

const mealPlanSchemaJoi = Joi.object({
  lunch: Joi.string().hex().length(24),
  breakfast: Joi.string().hex().length(24),
  dinner: Joi.string().hex().length(24),
  snacks: Joi.array().items(Joi.string().hex().length(24)),
  created_by: Joi.string().hex().length(24)
});

// Create a new meal plan
exports.createMealPlan = async (req, res) => {
  const { error } = mealPlanSchemaJoi.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newMealPlan = new MealPlan(req.body);
    await newMealPlan.save();
    res.status(201).json(newMealPlan);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

// Get all meal plans
exports.getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find().populate('lunch breakfast dinner snacks created_by');
    res.json(mealPlans);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get a specific meal plan by ID
exports.getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).populate('lunch breakfast dinner snacks created_by');
    if (!mealPlan) return res.status(404).json({ error: 'MealPlan not found' });
    res.json(mealPlan);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Update a meal plan by ID
exports.updateMealPlan = async (req, res) => {
  const { error } = mealPlanSchemaJoi.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMealPlan) return res.status(404).json({ error: 'MealPlan not found' });
    res.json(updatedMealPlan);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

// Delete a meal plan by ID
exports.deleteMealPlan = async (req, res) => {
  try {
    const deletedMealPlan = await MealPlan.findByIdAndDelete(req.params.id);
    if (!deletedMealPlan) return res.status(404).json({ error: 'MealPlan not found' });
    res.json(deletedMealPlan);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};
