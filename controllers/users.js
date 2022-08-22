const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const ValidationError = require('../error/ValidationError');
const UnauthorizedError = require('../error/UnauthorizedError');
const NotFound = require('../error/NotFoundError');
const ConflictError = require('../error/ConflictError');
const errCode = require('../const');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    // eslint-disable-next-line consistent-return
    .then((user) => {
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
      next(new UnauthorizedError('Неправильные почта или пароль'));
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // if (password.length === 0) {
  //   throw new ValidationError('Вы тупой или да? Введите пароль! Как заходить то будете?');
  // }
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      user: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        // eslint-disable-next-line no-new
        next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
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
    .catch((err) => {
      if (err.name === 'CastError') {
      // eslint-disable-next-line no-new
        next(new Error('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getAllUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

const getUser = (req, res, next) => {
  UserModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с указанным _id не найден.');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // eslint-disable-next-line no-new
        next(new Error('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
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
      if (err.name === 'CastError') {
        // eslint-disable-next-line no-new
        next(new Error('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
      if (err.name === 'CastError') {
        // eslint-disable-next-line no-new
        next(new Error('Переданы некорректные данные'));
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.errors.avatar.properties.message });
      } else {
        next(err);
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
