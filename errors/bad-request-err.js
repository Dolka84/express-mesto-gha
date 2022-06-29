class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    // this.messageUser = 'Переданы некорректные данные при создании пользователя';
    // this.messageCard = 'Переданы некорректные данные при создании карточки';
    // this.messageLike = 'Переданы некорректные данные для постановки/снятия лайка';
    // this.messageEmail = 'Некорректно указан Email';
  }
}

module.exports = BadRequestError;
