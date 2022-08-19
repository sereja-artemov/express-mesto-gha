const cardModel = require('../models/card');
const ValidationError = require('../error/ValidationError');
const NotFound = require('../error/NotFound');
const ForbiddenError = require('../error/ForbiddenError');
const errCode = require('../const');

const getAllCards = (req, res) => {
  cardModel.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(errCode.ServerError).send('Ой, что-то сломалось');
      }
    });
};

const delCard = (req, res) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      } else if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку.');
      }
      card.remove();
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err instanceof ForbiddenError) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(errCode.ValidationError).send({ message: 'Введены некорректные данные' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const addLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

const removeLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFound) {
        res.status(err.statusCode).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(errCode.ValidationError).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      } else {
        res.status(errCode.ServerError).send({ message: 'Ой, что-то сломалось' });
      }
    });
};

module.exports = {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
};
