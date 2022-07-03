const User = require('../models/user');
const { isTokenValid } = require('../helpers/jwt');
const AuthorizationError = require('../errors/auth-err');

module.exports = (req, res, next) => {
  // достаём jwt из кукис
  const token = req.cookies.jwt;
  // убеждаемся, что он есть
  if (!token) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw new AuthorizationError(AuthorizationError.message);
  }

  // верифицируем токен
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = isTokenValid(token);
    User.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          throw new AuthorizationError(AuthorizationError.message);
        }
        req.user = { _id: user._id };
        next();
      })
      .catch(next);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new AuthorizationError(AuthorizationError.message));
  }
};
