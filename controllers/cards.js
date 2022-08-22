const cardModel = require('../models/card');
const ValidationError = require('../error/ValidationError');
const NotFoundError = require('../error/NotFoundError');
const ForbiddenError = require('../error/ForbiddenError');

const getAllCards = (req, res, next) => {
  cardModel.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // eslint-disable-next-line no-new
        return next(new ValidationError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

const delCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      } else if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку.');
      }
      card.remove();
      res.status(200).send({ data: card });
    })
    .catch(next);
};

const addLikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      return next(err);
    });
};

const removeLikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // eslint-disable-next-line no-new
        return new ValidationError('Переданы некорректные данные для постановки/снятии лайка');
      }
      return next(err);
    });
};

module.exports = {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
};
