const http2 = require('http2');
const { CastError, ValidationError } = require('mongoose').Error;
const cardModel = require('../models/card');

const SUCСESSFUL_REQUEST = 200;
const CREATED = 201;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
const SERVER_ERROR = http2.constants.HTTP_STATUS_SERVER_ERROR; // 500

const getAllCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.status(SUCСESSFUL_REQUEST).send(cards);
    })
    .catch((err) => {
      console.error('Ошибка при получении карточек:', err);
      res.status(SERVER_ERROR).send({
        message: 'Ошибка по умолчанию.',
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(CREATED).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при создании карточки:', err);
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки - ${err.name}`,
        });
      } else {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  cardModel
    .findByIdAndRemove(cardId)
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      res.status(SUCСESSFUL_REQUEST).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
      if ((err instanceof CastError)) {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные при удалении карточки - ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена',
        });
      } else {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      res.status(SUCСESSFUL_REQUEST).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при постановке like:', err);
      if ((err instanceof CastError)) {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные для постановки лайка - ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

const dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => new Error('NotFound'))
    .then((card) => {
      res.status(SUCСESSFUL_REQUEST).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при удалении like:', err);
      if ((err instanceof CastError)) {
        res.status(BAD_REQUEST).send({
          message: `Переданы некорректные данные для снятия лайка - ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(NOT_FOUND).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else {
        res.status(SERVER_ERROR).send({
          message: 'Ошибка по умолчанию.',
        });
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
