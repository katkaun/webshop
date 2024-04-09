const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: {
      type: Number,
      required: true,
    }
});

// Export the Product model directly
module.exports = mongoose.model('Product', productSchema);
