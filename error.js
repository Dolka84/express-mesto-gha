// блок констант ошибок
const BAD_REQ = {
  code: 400, messageUser: 'Переданы некорректные данные при создании пользователя', messageCard: 'Переданы некорректные данные при создании карточки', messageLike: 'Переданы некорректные данные для постановки/снятия лайка',
};
const NOT_FOUND = {
  code: 404, messageUser: 'Пользователь по указанному _id не найден', messageCard: 'Карточка с указанным _id не найдена', messageLike: 'Передан несуществующий _id карточки', message: 'Страница не найдена',
};
const SOME_ERROR = { code: 500, message: 'Ошибка по-умолчанию' };

const MONGO_DUPLICATE = { code: 409, message: 'Email уже занят' };

module.exports = {
  BAD_REQ,
  NOT_FOUND,
  SOME_ERROR,
  MONGO_DUPLICATE,
};
