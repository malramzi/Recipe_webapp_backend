const Recipe = require("../models/Recipe");
const Joi = require("joi");

const recipeSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    procedures: Joi.array().items(Joi.string()).required(),
    cook_time: Joi.string().required(),
    desc: Joi.string(),
    category: Joi.string().hex().length(24),
    image: Joi.string().required(),
  });


// Create a new recipe
exports.createRecipe = async (req, res) => {
  
  const parsedData = {...req.body,ingredients:JSON.parse(req.body.ingredients || '[]'),procedures:JSON.parse(req.body.procedures || '[]')}
  if(req.file)
    parsedData.image = req.file.filename
  else 
    return res.status(400).json({ error: "Image is Required" });
  const { error } = recipeSchema.validate(parsedData);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const recipe = new Recipe({...parsedData,posted_by:req.user._id});
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// Get all ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    const recipes = await Recipe.find({}, {ingredients:1,_id:0});
    const allIngredients = recipes.reduce((prev, curr) => [...prev, ...curr.ingredients], [])
    const uniqueIngredients = [...new Set(allIngredients)];
    res.json(uniqueIngredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("posted_by");
    let modifiedRecipes = recipes.map((recipe) => ({...recipe.toObject(),id:recipe._id.toString()}))
    res.json(modifiedRecipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get recipes created by a specific user
exports.getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ posted_by: req.user._id });
    let modifiedRecipes = recipes.map((recipe) => ({...recipe.toObject(),id:recipe._id.toString()}))
    res.json(modifiedRecipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("posted_by").populate("category");
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecipeByUser = async (req, res) => {
  try {
    const recipe = await Recipe.find({posted_by : req.user._id}).populate("posted_by").populate("category");
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findClosestRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body; // Get ingredients from request

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
          throw new Error("Ingredients are Required")
        }

        let inputSet = new Set(ingredients)

        // Fetch all recipes
        const recipes = await Recipe.find();

        // Process recipes and calculate match count
        const processedRecipes = recipes.map(recipe => {
            let matchCount = recipe.ingredients.reduce((count, recipeIngredient) => {
              return inputSet.has(recipeIngredient.toLowerCase()) || 
                     [...inputSet].some(inputIngredient => recipeIngredient.toLowerCase().includes(inputIngredient))
                  ? count + 1
                  : count;
          }, 0)
            recipe.populate("posted_by")
            return {
                ...recipe.toObject(),
                id: recipe._id.toString(),
                matchCount,
                matchPercentage: ((matchCount / recipe.ingredients.length) * 100).toFixed(2) + "%"
            };
        }).filter(recipe => recipe.matchCount > 0);

        // Sort recipes by highest match count
        const sortedRecipes = processedRecipes.sort((a, b) => b.matchCount - a.matchCount);

        if (sortedRecipes.length === 0) {
            throw new Error("No matching recipes found.")
        }
        res.json(sortedRecipes);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

// Update a recipe by ID
exports.updateRecipe = async (req, res) => {
  try {
    const data = {...req.body}
    if(req.file)
      data.image = req.file.filename
    delete data.posted_by
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a recipe by ID
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

