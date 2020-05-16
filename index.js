const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
require('dotenv').config();

const auth = require('./Routes/auth');
const product = require('./product/productDetail');
const cart = require('./Routes/cart');

const app = express();
app.use(cors());


//USING MIDDLEWare
app.use(volleyball);
app.use(express.json());

//TO request
app.use('/auth', auth); 
app.use('/cart',cart);
app.use('/product', product);

app.get('/', (req, res) => {
  res.json({
    message: 'HOME GET REQUEST'
  });
  res.send();
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

//APP Is Listening On PORT
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});