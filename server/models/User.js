const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: 'This field is required.'
  },
  last_name: {
    type: String,
    required: 'This field is required.'
  },
  password: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  phone: {
    type: Number,
  },
  image: {
    type: String,
  },
  liked_recipes:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'recipe',
  },
  saved_recipes:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'recipe',
  }
});

userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
      next();
  }else{
      this.password = await bcrypt.hash(this.password,10)
  }
})

userSchema.pre("insertMany",async function(next,docs){
  docs.map(async function (doc, index) {
    doc.password = await bcrypt.hash(doc.password,10)
  });
})

userSchema.methods.getJWTToken = function (){
  return jwt.sign({id:this._id},process.env.JWT_SECRET ,{
      expiresIn:process.env.JWT_EXPIRE || "1h",
  })
}

userSchema.methods.comparePassword = async function(userPassword){
  return await bcrypt.compare(userPassword,this.password)
}

userSchema.index({ phone: 'number', email: 'text' });

module.exports = mongoose.model('user', userSchema);