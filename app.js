const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routerUser = require('./routes/user');
const routerCard = require('./routes/card');
const NotFoundError = require('./errors/not-found-err');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser()); // подключаем парсер кук как мидлвэр
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), createUser);
// авторизация
app.use(auth);
app.use('/', routerUser);
app.use('/', routerCard);
app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errors()); // обработчик ошибок celebrate
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
    // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  if (statusCode === 500) {
    console.log(err.stack);
  }
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
// комментарий для теста 13062023
// комментарий 2
