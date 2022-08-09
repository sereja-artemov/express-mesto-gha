const cardModel = require('../models/card');
const ValidationError = require('../error/ValidationError');
const NotFound = require('../error/NotFound');

const getAllCards = (req, res) => {
  cardModel.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Введены неправильные данные' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
    });
};

const delCard = (req, res) => {
  cardModel.findByIdAndRemove(req.params._id)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
    });
};

const addLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
    });
};

const removeLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
    });
};

module.exports = {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
};
