const express = require('express');
// const morgan = require('morgan'); this is a http logger kind of debugging tool same as volleyball
const volleyball = require('volleyball');
const auth = require('./auth/index');
const product = require('./product/productDetail');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(volleyball);
app.use(express.json());

// app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨Hello World! 🌈✨🦄'
  });

  res.send();
});

app.use('/auth', auth); // every router passing here is using /auth
app.use('/product', product);
function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});