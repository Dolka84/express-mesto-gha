const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    // .populate('owner')
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id.toString();
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(BAD_REQ.code).send({ message: BAD_REQ.messageCard });
        // return;
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
      // res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError(ForbiddenError.message);
      }
      Card.deleteOne(card)
        .then(() => {
          res.status(200).send({ message: 'Карточка удалена!' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      next(err);
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
        // res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageLike });
        // return;
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(BAD_REQ.code).send({ message: BAD_REQ.messageLike });
        // return;
        throw new BadRequestError('Переданы некорректные данные для постановки/снятия лайка');
      }
      // res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
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
        // res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageLike });
        // return;
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(BAD_REQ.code).send({ message: BAD_REQ.messageLike });
        // return;
        throw new BadRequestError('Переданы некорректные данные для постановки/снятия лайка');
      }
      // res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};
