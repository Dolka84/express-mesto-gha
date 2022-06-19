const User = require('../models/user');
const {
  BAD_REQ,
  NOT_FOUND,
  SOME_ERROR,
} = require('../error');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message }));
};

module.exports.getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id, // временное решение авторизации (req.user._id)
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id, // временное решение авторизации (req.user._id)
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};
