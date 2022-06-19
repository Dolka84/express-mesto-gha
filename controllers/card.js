const Card = require('../models/card');
const {
  BAD_REQ,
  NOT_FOUND,
  SOME_ERROR,
} = require('../error');

module.exports.getCard = (req, res) => {
  Card.find({})
    // .populate('owner')
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message }));
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id; // временное решение авторизации
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageCard });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageCard });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageCard });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.setLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageLike });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageLike });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageLike });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageLike });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};
