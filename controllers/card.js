const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    // .populate('owner')
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id.toString();
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (req.user._id.toString() !== card.owner.toString()) {
        throw new ForbiddenError(ForbiddenError.message);
      }
      Card.deleteOne({ card })
        .then(() => {
          res.status(200).send({ message: 'Карточка удалена!' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.setLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки/снятия лайка');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки/снятия лайка');
      } else {
        next(err);
      }
    })
    .catch(next);
};
