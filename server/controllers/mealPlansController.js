const MealPlan = require('../models/MealPlan');
const Joi = require('joi');
const Recipe = require('../models/Recipe');

const mealPlanSchemaJoi = Joi.object({
  title: Joi.string().required(),
  lunch: Joi.string().hex().length(24),
  breakfast: Joi.string().hex().length(24),
  dinner: Joi.string().hex().length(24),
  snacks: Joi.array().items(Joi.string().hex().length(24)),
  posted_by: Joi.required()
});

// Create a new meal plan
exports.createMealPlan = async (req, res) => {
  console.log({...req.body,posted_by:req.user._id})
  const { error } = mealPlanSchemaJoi.validate({...req.body,posted_by:req.user._id});
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newMealPlan = new MealPlan({...req.body,posted_by:req.user._id});
    await newMealPlan.save();
    await newMealPlan.populate("lunch breakfast dinner snacks posted_by")
    res.status(201).json(newMealPlan);
  } catch (ex) {
    res.status(400).json({ error: ex.message });
  }
};

// Get all meal plans
exports.getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find().populate('lunch breakfast dinner snacks posted_by');
    res.json(mealPlans);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};


// Get User meal plans
exports.getUserMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({posted_by:req.user_id}).populate('lunch breakfast dinner snacks posted_by');
    res.json(mealPlans);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Get a specific meal plan by ID
exports.getMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).populate('lunch breakfast dinner snacks posted_by');
    if (!mealPlan) return res.status(404).json({ error: 'MealPlan not found' });
    res.json(mealPlan);
  } catch (ex) {
    res.status(500).json({ error: ex.message });
  }
};

// Update a meal plan by ID
exports.updateMealPlan = async (req, res) => {
  console.log(req.body)
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
