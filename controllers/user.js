/* eslint-disable max-len */
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');
const { generateToken } = require('../helpers/jwt');

require('dotenv').config();

const { SALT_ROUND = 10 } = process.env;
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/bad-request-err');
const MongoDuplicateError = require('../errors/mongo-duplicate-error');
const AuthorizationError = require('../errors/auth-err');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.getProfileUser = (req, res, next) => {
  User.find(req.user._id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.getUserByID = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        // res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageUser });
        // return;
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
        // return;
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
      // res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.createUser = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    const {
      name, about, avatar, email, password,
    } = req.body;
    bcrypt
      .hash(password, SALT_ROUND)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then(() => res.status(200).send({
        data: {
          name, about, avatar, email,
        },
      }))
      .catch((err) => {
        if (err.code === 11000) {
          // res.status(MONGO_DUPLICATE.code).send({ message: MONGO_DUPLICATE.message });
          // return;
          throw new MongoDuplicateError(MongoDuplicateError.message);
        }
        if (err.name === 'ValidationError') {
          // res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
          // return;
          throw new BadRequestError('Переданы некорректные данные при создании пользователя');
        }
        next();
      });
    return;
  }
  // res.status(400).send({ message: 'Invalid Email' });
  throw new BadRequestError('Некорректно указан Email');
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        // res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageUser });
        // return;
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        // res.status(NOT_FOUND.code).send({ message: NOT_FOUND.messageUser });
        // return;
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(BAD_REQ.code).send({ message: BAD_REQ.messageUser });
        // return;
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      // res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
      next(err);
    });
};
module.exports.login = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    const { email, password } = req.body;
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = generateToken({ _id: user._id });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7, // срок куки 7 дней
          httpOnly: true,
        });
        console.log(token);
        res.send({ message: 'Проверка прошла успешно!' });
      })
      .catch(() => {
        // res.status(401).send({ message: err.message });
        next(new AuthorizationError(AuthorizationError.message));
      });
  }
  // return res.status(400).send({ message: 'Invalid Email' });
  throw new BadRequestError('Некорректно указан Email');
};
