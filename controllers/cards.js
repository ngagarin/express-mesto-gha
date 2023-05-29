const cardModel = require('../models/card');

const getAllCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      console.error('Ошибка при получении карточек:', err);
      res.status(500).send({
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
      res.status(201).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при создании карточки:', err);
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Переданы некорректные данные при создании карточки -- ${err.name}`,
        });
      } else {
        res.status(500).send({
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
      res.status(200).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при удалении карточки:', err);
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Переданы некорректные данные при удалении карточки -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена',
        });
      } else {
        res.status(500).send({
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
      res.status(200).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при постановке like:', err);
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Переданы некорректные данные для постановки лайка -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else {
        res.status(500).send({
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
      res.status(200).send(card);
    })
    .catch((err) => {
      console.error('Ошибка при удалении like:', err);
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Переданы некорректные данные для снятия лайка -- ${err.name}`,
        });
      } else if (err.message === 'NotFound') {
        res.status(404).send({
          message: 'Передан несуществующий _id карточки',
        });
      } else {
        res.status(500).send({
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
