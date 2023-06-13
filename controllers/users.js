const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { SECRETKEY } = require('../middlewares/auth');
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} = require('../utils/errors/index');
const {
  SUCСESSFUL_REQUEST,
  CREATED,
} = require('../utils/constants');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRETKEY, { expiresIn: '7d' });
      res.status(SUCСESSFUL_REQUEST).send({ token });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => res.status(SUCСESSFUL_REQUEST).send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  let userId;
  if (req.params.userId) userId = req.params.userId;
  else userId = req.user._id;

  userModel
    .findById(userId)
    .orFail(new NotFoundError(`Пользователь с id:${userId} не найден`))
    .then((user) => res.status(SUCСESSFUL_REQUEST).send({ data: user }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

const createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => userModel
      .create({
        ...req.body, password: hash,
      }))
    .then(({
      name, about, avatar, email, _id, createdAt,
    }) => {
      res.status(CREATED).send(
        {
          data: {
            name, about, avatar, email, _id, createdAt,
          },
        },
      );
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с указанным email уже зарегистрирован'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с id:${req.user._id} не найден`))
    .then((user) => res.status(SUCСESSFUL_REQUEST).send({ data: user }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с id:${req.user._id} не найден`))
    .then((user) => res.status(SUCСESSFUL_REQUEST).send({ data: user }))
    .catch((err) => {
      if (err instanceof NotFoundError) {
        return next(err);
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(new InternalServerError('Произошла ошибка на сервере.'));
    });
};

module.exports = {
  login,
  getAllUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
