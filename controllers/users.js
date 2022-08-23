const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const ValidationError = require('../error/ValidationError');
const ConflictError = require('../error/ConflictError');
const NotFound = require('../error/NotFoundError');
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
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой email уже существует'));
      }
      return next(err);
    });
};

const getAllUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  UserModel.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw next(new NotFound('Пользователь с указанным _id не найден.'));
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw next(new NotFound('Пользователь с указанным _id не найден.'));
      }
      res.status(200).send(user);
    })
    .catch(next);
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
        next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
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
    .catch(next);
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
