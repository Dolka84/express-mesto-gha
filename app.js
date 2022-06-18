const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/user');
const routerCard = require('./routes/card');

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
// Захардкодили идентификатор пользователя для добавления owner в card (временное решение)
app.use((req, res, next) => {
  req.user = {
    _id: '62ac615d058b5eeea1753e2e',
  };
  next();
});

app.use('/', routerUser);
app.use('/', routerCard);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
