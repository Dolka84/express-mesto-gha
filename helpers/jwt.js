const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV = 'production', JWT_SECRET = '3ed9a2614ca13da571c7873859309b0bf83232a83221ed21ed970d4b67c45230' } = process.env;

const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

const isTokenValid = (token) => jwt.verify(token, JWT_SECRET);
module.exports = { generateToken, isTokenValid };
