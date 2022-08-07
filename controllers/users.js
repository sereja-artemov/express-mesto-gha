const UserModel = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  UserModel.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getAllUsers = (req, res) => {
  UserModel.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  UserModel.findById(req.params._id)
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = { createUser, getAllUsers, getUser };
