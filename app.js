const express = require('express');
const mongoose = require('mongoose');
const http2 = require('http2');

const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;
const router = require('./routes');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64750da73ef32cfdc53ee160',
  };
  next();
});
app.use(router);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
