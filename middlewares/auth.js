const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const { JWT_SECRET } = process.env;

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
    payload = jwt.verify(token, JWT_SECRET);

    User.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          return res.status(401).send({ message: 'Авторизуйтесь для доступа' });
        }
        console.log(user._id);
        req.user = { _id: user._id };
        next();
      });
  } catch (err) {
    // отправим ошибку, если не получилось
    console.log(err);
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
};
