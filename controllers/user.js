/* eslint-disable max-len */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const {
  BAD_REQ,
  NOT_FOUND,
  SOME_ERROR,
  MONGO_DUPLICATE,
} = require('../error');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET, SALT_ROUND } = process.env;

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message }));
};

module.exports.getProfileUser = (req, res) => {
  User.find(req.user._id)
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
  if (validator.isEmail(req.body.email)) {
    const {
      name, about, avatar, email, password,
    } = req.body;
    bcrypt
      .hash(password, SALT_ROUND)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.status(200).send({ data: user }))
      .catch((err) => {
        if (err.code === 11000) {
          res.status(MONGO_DUPLICATE.code).send({ message: MONGO_DUPLICATE.message });
          return;
        }
        if (err.name === 'ValidationError') {
          res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
          return;
        }
        res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
      });
    return;
  }
  res.status(400).send({ message: 'Invalid Email' });
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
module.exports.login = (req, res) => {
  if (validator.isEmail(req.body.email)) {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }); // срок токена 7 дней
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, // срок куки 7 дней
          httpOnly: true,
        });
        console.log(token);
        res.send({ message: 'Проверка прошла успешно!' });
      })
      .catch((err) => {
        res.status(401).send({ message: err.message });
      });
  }
  return res.status(400).send({ message: 'Invalid Email' });
};
