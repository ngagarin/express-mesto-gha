const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
  /* eslint no-console: ["error", { allow: ["log"] }] */
  console.log(`App listening on port ${PORT}`);
});
