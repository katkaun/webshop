const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
      type: Number,
      required: true,
    }
  })
  
  module.exports = mongoose.model('User', userSchema);

   
