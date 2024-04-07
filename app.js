const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose'); //like an import. We are importing every library and store it in a constant

require('dotenv/config');
const api = process.env.API_URL;

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny')); //to display log request 


const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  }
})

const Product = mongoose.model('Product', productSchema);


app.get("/", (req, res) => {
  res.send("Welcome to the webshop!");
});

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();

  if(!productList) {
    res.status(500).json({success: false})
  }
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  })

  product.save().then((createdProduct => {
    res.status(201).json(createdProduct)
  })).catch((error) => {
    res.status(500).json({
      error: error,
      success: false,
    })
  })
});

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database Connection is ready...')
  })
  .catch((error) => {
    console.log(error); // Log the actual error message
  });

app.listen(3000, () => {
  
  console.log('Server is running on port 3000');
})
