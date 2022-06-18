const Card = require('../models/card');
// блок констант ошибок
const BAD_REQ = {code: 400, message: 'Переданы некорректные данные при создании карточки', messageLike: 'Переданы некорректные данные для постановки/снятии лайка'};
const NOT_FOUND = {code: 404, message: 'Карточка с указанным _id не найдена', messageLike: 'Передан несуществующий _id карточки'};
const SOME_ERROR = {code: 500, message: 'Ошибка по-умолчанию'};

module.exports.getCard = (req, res) => {
  Card.find({})
   .populate('owner')
   .then(card => res.send({ card }))
   .catch(() => res.status(SOME_ERROR.code).send(SOME_ERROR.message));
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id; // временное решение авторизации
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then(card => res.send({ card }))
    .catch(err => {
      if(err.name === 'ValidationError') {
        res.status(BAD_REQ.code).send(BAD_REQ.message)
        return
      }
      res.status(SOME_ERROR.code).send(SOME_ERROR.message)
    })
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if(!card) {
        res.status(NOT_FOUND.code).send(NOT_FOUND.message)
        return
      }
      res.send({ card })
    })
    .catch(() => res.status(SOME_ERROR.code).send(SOME_ERROR.message));
};

module.exports.setLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },   // добавить _id в массив, если его там нет
    { new: true }
    )
    .then(card => {
      if(!card) {
        res.status(NOT_FOUND.code).send(NOT_FOUND.messageLike)
        return
      }
      res.send({ card })
    })
    .catch(() => res.status(SOME_ERROR.code).send(SOME_ERROR.message));
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },   // убрать _id из массива
    { new: true }
    )
    .then(card => {
      if(!card) {
        res.status(NOT_FOUND.code).send(NOT_FOUND.messageLike)
        return
      }
      res.send({ card })
    })
    .catch(() => res.status(SOME_ERROR.code).send(SOME_ERROR.message));
};