const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose'); //like an import. We are importing every library and store it in a constant
const cors = require('cors');
require('dotenv/config');
// const authJwt = require('./helpers/jwt');
const handleErrors = require('./helpers/handleErrors')

app.use(cors({
  origin: 'http://localhost:5175'
}));
app.options('*', cors());


//Database
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database Connection is ready...')
  })
  .catch((error) => {
    console.log('db error! oh no..');
    // console.log(error);
  });

//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'));      //to display log request
// app.use(authJwt());
app.use(handleErrors)


//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const api = process.env.API_URL;
// console.log(api)

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

// app.get("/", (req, res) => {
//   res.send("Welcome to the webshop!");
// });


app.listen(3000, () => {
  
  console.log('Server is running on port 3000');
});