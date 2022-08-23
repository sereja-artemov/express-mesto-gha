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
    .then((card) => res.status(200).send({
      card: {
        name: card.name,
        link: card.link,
        _id: card._id,
      },
    }))
    .catch(next);
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
      return res.status(200).send({ data: card });
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
    .catch(next);
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
      res.status(200).send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
};
