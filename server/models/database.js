const req = require('express/lib/request');
const mongoose = require('mongoose');
const { ErrorHandler } = require('../utils/ErrorHandler');

exports.dbConnect = async function (){
  try{
    console.log(process.env.MONGODB_URI)
      await mongoose.connect(process.env.MONGODB_URI || "",{
        dbName: 'recipeDB',
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });
      console.log("db connection established")
  }catch(error){
      throw new ErrorHandler("db connection failed",500)
  }
}



// Models
require('./Category');
require('./Recipe');
require('./User');
require('./Meal');
require('./MealPlan');
