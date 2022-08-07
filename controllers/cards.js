const cardModel = require('../models/card');
const errorMessage = require('../utils/errors');

const getAllCards = (req, res) => {
  cardModel.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(500).send(errorMessage));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel.create({ name, link })
    .then(card => res.send(card))
    .catch(err => res.status(500).send(errorMessage));
};

const delCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params._id)
    .then(card => res.send(card))
    .catch(err => res.status(500).send(errorMessage));
};

const addLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(likes => res.send(likes))
    .catch(err => res.status(500).send(errorMessage));
};

const removeLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(likes => res.send(likes))
    .catch(err => res.status(500).send(errorMessage));
};

module.exports = { getAllCards, createCard, delCard, addLikeCard, removeLikeCard };
