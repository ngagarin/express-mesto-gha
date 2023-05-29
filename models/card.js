const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 2 && value.length <= 30;
      },
      message: 'Название должно быть от 2 до 30 символов.',
    },
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
