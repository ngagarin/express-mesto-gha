const http2 = require('http2');
const userModel = require('../models/user');

const SUCСESSFUL_REQUEST = http2.constants.HTTP_STATUS_SUCСESSFUL_REQUEST; // 200
const CREATED = 201;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const SERVER_ERROR = http2.constants.HTTP_STATUS_SERVER_ERROR; // 500

const getAllUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(SUCСESSFUL_REQUEST).send(users);
    })
    .catch((err) => {
      console.error('Ошибка при получении списка пользователей:', err);
      res.status(SERVER_ERROR).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  userModel
    .findById(userId)
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.status(SUCСESSFUL_REQUEST).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при получении пользователя:', err);
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при создании пользователя:', err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
        });
      } else if (err) {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.status(SUCСESSFUL_REQUEST).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении пользователя:', err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные при обновлении профиля -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найден',
        });
      } else {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.status(SUCСESSFUL_REQUEST).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные при обновлении аватара -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
