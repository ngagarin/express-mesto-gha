const cardModel = require('../models/card');

const getAllCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Ошибка по умолчанию.',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Переданы некорректные данные при создании карточки -- ${err.name}`,
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
          message: 'Ошибка по умолчанию.',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  cardModel
    .findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена',
          err: 'NotFound',
        });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Переданы некорректные данные при удалении карточки -- ${err.name}`,
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
          message: 'Ошибка по умолчанию.',
          err: err.message,
          stack: err.stack,
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
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена',
          err: 'NotFound',
        });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Переданы некорректные данные для постановки лайка -- ${err.name}`,
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
          message: 'Ошибка по умолчанию.',
          err: err.message,
          stack: err.stack,
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
    .then((card) => {
      if (!card) {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена',
          err: 'NotFound',
        });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Переданы некорректные данные для снятия лайка -- ${err.name}`,
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
          message: 'Ошибка по умолчанию.',
          err: err.message,
          stack: err.stack,
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






