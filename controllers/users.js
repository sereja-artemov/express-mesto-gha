const UserModel = require('../models/user');
const errorMessage = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserModel.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send(errorMessage));
};

const getAllUsers = (req, res) => {
  UserModel.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send(errorMessage));
};

const getUser = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  UserModel.findById(req.params._id)
    .then(user => res.send(user))
    .catch(err => res.status(500).send(errorMessage));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { name, about })
    .then(user => res.send(user))
    .catch(err => res.status(500).send(errorMessage));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send(errorMessage));
};

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
};
