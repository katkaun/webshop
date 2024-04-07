const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose'); //like an import. We are importing every library and store it in a constant


//middleware
app.use(bodyParser.json());
app.use(morgan('tiny')); //to display log request 


require('dotenv/config');

const api = process.env.API_URL;

app.get("/", (req, res) => {
  res.send("Welcome to the webshop!");
});

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'hair dresser',
    image: 'some_url',
  }
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  res.send(newProduct);
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
