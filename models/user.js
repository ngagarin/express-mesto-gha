const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 2 && value.length <= 30;
      },
      message: 'Имя должно быть от 2 до 30 символов.',
    },
  },
  about: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value.length >= 2 && value.length <= 30;
      },
      message: 'Описание профиля должно быть от 2 до 30 символов.',
    },
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlPattern.test(value);
      },
      message: 'Некорректный URL.',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
