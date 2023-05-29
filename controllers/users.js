const userModel = require('../models/user');

const getAllUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(200);
      res.send(users);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: 'Ошибка по-умолчанию.',
          err: err.message,
          stack: err.stack,
        });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  userModel
    .findById(userId)
    .then((users) => {
      res.status(200);
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
            err: err.message,
            stack: err.stack,
          });
      } else if (err.message === 'NotFound') {
        res.status(404)
          .send({
            message: 'Пользователь по указанному _id не найден',
            err: err.message,
            stack: err.stack,
          });
      } else {
        res.status(500)
          .send({
            message: 'Ошибка по умолчанию.',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((users) => {
      res.status(200);
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
            err: err.message,
            stack: err.stack,
          });
      } else {
        res.status(500)
          .send({
            message: 'Ошибка по умолчанию.',
            err: err.message,
            stack: err.stack,
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
    )
    .then((users) => {
      res.status(200);
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
            err: err.message,
            stack: err.stack,
          });
      } else if (err.message === 'NotFound') {
        res.status(404)
          .send({
            message: 'Пользователь по указанному _id не найден',
            err: err.message,
            stack: err.stack,
          });
      } else {
        res.status(500)
          .send({
            message: 'Ошибка по умолчанию.',
            err: err.message,
            stack: err.stack,
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
    )
    .then((users) => {
      res.status(200);
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
            err: err.message,
            stack: err.stack,
          });
      } else if (err.message === 'NotFound') {
        res.status(404)
          .send({
            message: 'Пользователь по указанному _id не найден',
            err: err.message,
            stack: err.stack,
          });
      } else {
        res.status(500)
          .send({
            message: 'Ошибка по умолчанию.',
            err: err.message,
            stack: err.stack,
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
