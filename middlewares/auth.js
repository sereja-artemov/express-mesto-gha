const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../error/UnauthorizedError');

const { JWT_SECRET } = process.env;
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
