const userModel = require('../models/user');

const getAllUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error('Ошибка при получении списка пользователей:', err);
      res.status(500).send({
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
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при получении пользователя:', err);
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(500).send({
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
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при создании пользователя:', err);
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Переданы некорректные данные при создании пользователя -- ${err.name}`,
        });
      } else if (err) {
        res.status(500).send({
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
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении пользователя:', err);
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Переданы некорректные данные при обновлении профиля -- ${err.name}`
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь с указанным _id не найден',
        });
      } else {
        res.status(500).send({
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
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error('Ошибка при обновлении аватара:', err);
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Переданы некорректные данные при обновлении аватара -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(500).send({
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
