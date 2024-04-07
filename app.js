const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose'); //like an import. We are importing every library and store it in a constant

require('dotenv/config');
const api = process.env.API_URL;


const productsRouter = require('./routers/products');

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny')); //to display log request 


//Routers
app.use(`${api}/products`, productsRouter);


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



//Rad 19 typ, under Routers.

// app.get("/", (req, res) => {
//   res.send("Welcome to the webshop!");
// });