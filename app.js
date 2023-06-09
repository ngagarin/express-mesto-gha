const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const handleError = require('./middlewares/handleError');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(router);
app.use(handleError);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
