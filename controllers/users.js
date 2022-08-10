const UserModel = require('../models/user');
const ValidationError = require('../error/ValidationError');
const NotFound = require('../error/NotFound');
const errCode = require('../const');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserModel.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при создании пользователя.' });
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

const getUser = async (req, res) => {
  UserModel.findById(req.params.userId)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      throw new NotFound('Пользователь с указанным _id не найден.');
      // eslint-disable-next-line no-unreachable
      if (err instanceof NotFound) {
        res.status(errCode.NotFoundError).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const updateUser = async (req, res) => {
  const { name, about } = req.body;

  try {
    if (!name || !about) {
      throw new ValidationError('Переданы некорректные данные');
    }
    // eslint-disable-next-line max-len
    const user = await UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true });
    if (!user) {
      throw new NotFound('Пользователь с указанным _id не найден.');
    }
    res.status(200).send({ data: user });
  } catch (err) {
    if (err instanceof NotFound) {
      res.status(errCode.NotFoundError).send({ message: err.message });
    } else if (err.name === 'ValidationError') {
      res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    } else {
      res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
    }
  }
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
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
};
