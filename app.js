const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const routerUser = require('./routes/user');
const routerCard = require('./routes/card');
const NotFoundError = require('./errors/not-found-err');
const { login, createUser } = require('./controllers/user');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

app.post('/signin', login);
app.post('/signup', createUser);
// авторизация
app.use(auth);
app.use('/', routerUser);
app.use('/', routerCard);
app.use('*', (req, res) => {
  // res.status(NOT_FOUND.code).send({ message: NOT_FOUND.message });
  throw new NotFoundError('Страница не найдена');
});
app.use((err, req, res, next) => {
  console.log(err);
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  console.log('message', err.message);
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
