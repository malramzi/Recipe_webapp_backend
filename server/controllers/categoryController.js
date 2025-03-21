const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  posted_by: Joi.string().hex().length(24),
});

exports.createCategory = async (req, res) => {
  const { error } = categorySchema.validate({...req.body,posted_by : req.user._id.toString()});

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const category = new Category({...req.body,posted_by : req.user._id});
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const categoriesFetcher = async (req, res, user) => {
  try {

    let aggregateConfig = [
      {
        $group: {
          _id: "$category",
          recipes: { $sum : 1}
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      }
    ]

    const categoryRecordArray = await Recipe.aggregate(aggregateConfig);
    
    const categories = categoryRecordArray
    // .filter(category => {
    //   console.log(category.category.posted_by.toString() , user.toString())
    //   return category.category.posted_by.toString() == user.toString()
    // })
    .map((category) => { 
      return {...category.category, recipes: category.recipes};
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
exports.getAllCategories = async (req, res) => {
  try {
    const category = await Category.find({});
    if (!category || !category.length) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  // categoriesFetcher(req, res);
};

exports.getAllCategoriesByUser = async (req, res) => {
  try {
    const category = await Category.find({posted_by : req.user._id});
    if (!category || !category.length) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  //categoriesFetcher(req, res, req.user._id);
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
