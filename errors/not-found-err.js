class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    // this.message = 'Страница не найдена';
    // this.messageUser = 'Пользователь по указанному _id не найден';
    // this.messageCard = 'Карточка с указанным _id не найдена';
    // this.messageLike = 'Передан несуществующий _id карточки';
  }
}

module.exports = NotFoundError;
