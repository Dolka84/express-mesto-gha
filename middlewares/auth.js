// const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { isTokenValid } = require('../helpers/jwt');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = isTokenValid(token);

    User.findOne({ _id: payload._id })
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (!user) {
          return res.status(401).send({ message: 'Авторизуйтесь для доступа' });
        }
        req.user = { _id: user._id };
        next();
      });
  } catch (err) {
    // отправим ошибку, если не получилось
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};
