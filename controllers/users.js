const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const ValidationError = require('../error/ValidationError');
const NotFound = require('../error/NotFound');
const errCode = require('../const');

const login = (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // создаем токен
      const { JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: matched._id }, JWT_SECRET);
      res.cookie('jwt', token, {
        maxAge: '7d',
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      UserModel.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const getCurrentUser = (req, res) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(errCode.NotFoundError).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const getAllUsers = (req, res) => {
  UserModel.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' }));
};

const getUser = (req, res) => {
  UserModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(errCode.NotFoundError).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  if (!name || !about) {
    res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  }

  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(errCode.NotFoundError).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  // eslint-disable-next-line max-len
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(errCode.NotFoundError).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

module.exports = {
  login,
  createUser,
  getAllUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateAvatar,
};
