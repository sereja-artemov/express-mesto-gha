const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
  }),
}), createCard);
cardsRouter.delete('/:cardId', delCard);
cardsRouter.put('/:cardId/likes', addLikeCard);
cardsRouter.delete('/:cardId/likes', removeLikeCard);

module.exports = cardsRouter;
