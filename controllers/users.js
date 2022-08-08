const UserModel = require('../models/user');
const IncorrectData = require('../error/IncorrectData');
const NotFound = require('../error/NotFound');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserModel.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'IncorrectData') {
        throw new IncorrectData('Переданы некорректные данные при создании пользователя.');
      }
    });
};

const getAllUsers = (req, res) => {
  UserModel.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send('errrrr'));
};

const getUser = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  UserModel.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFound('Пользователь по указанному _id не найден.');
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFound('Пользователь с указанным _id не найден.');
      } else if (err.name === 'IncorrectData') {
        throw new IncorrectData('Переданы некорректные данные при обновлении профиля.');
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFound('Пользователь с указанным _id не найден.');
      } else if (err.name === 'IncorrectData') {
        throw new IncorrectData('Переданы некорректные данные при обновлении аватара.');
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
