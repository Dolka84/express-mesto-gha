const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
   .populate('owner')
   .then(card => res.send({ card }))
   .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id; // временное решение авторизации
  const { name, link } = req.body;
  Card.create({ name, link, owner: ownerId })
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.setLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },   // добавить _id в массив, если его там нет
    { new: true }
    )
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },   // убрать _id из массива
    { new: true }
    )
    .then(card => res.send({ card }))
    .catch(err => res.status(500).send({ message: err.message }));
};