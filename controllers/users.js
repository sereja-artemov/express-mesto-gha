const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const ValidationError = require('../error/ValidationError');
const NotFound = require('../error/NotFoundError');
const errCode = require('../const');

const login = (req, res) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      // создаем токен
      const { JWT_SECRET } = process.env;
      const jwtToken = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', jwtToken, {
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token: jwtToken });
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
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const getCurrentUser = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      res.send(user);
    })
    .catch(next);
  // .catch((err) => {
  //   if (err instanceof NotFound) {
  //     res.status(errCode.NotFoundError).send({ message: err.message });
  //   } else if (err.name === 'CastError') {
  //     res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные' });
  //   } else {
  //     res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
  //   }
  // });
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
