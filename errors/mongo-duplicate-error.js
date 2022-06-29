class MongoDuplicateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = 'Email уже занят';
  }
}

module.exports = MongoDuplicateError;
