const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose'); //like an import. We are importing every library and store it in a constant
const cors = require('cors');

require('dotenv/config');

app.use(cors());
app.options('*', cors());

//Database
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database Connection is ready...')
  })
  .catch((error) => {
    console.log(error);
  });

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny')); //to display log request



//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the webshop!");
});

//Server
app.listen(3000, () => {
  
  console.log('Server is running on port 3000');
});