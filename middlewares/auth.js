const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  //
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   return res.status(401).send({ message: 'Необходима авторизация' });
  // }
  // извлечём токен
  // const token = authorization.replace('Bearer ', '');
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
