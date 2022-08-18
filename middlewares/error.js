module.exports = (err, req, res, next) => {
  const { errCode = 500, message } = err;
  res.status(errCode).send({ message: errCode === 500 ? 'На сервере произошла ошибка' : message });

  next();
};
