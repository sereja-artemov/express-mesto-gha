const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);
cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), delCard);
cardsRouter.put('/:cardId/likes', addLikeCard);
cardsRouter.delete('/:cardId/likes', removeLikeCard);

module.exports = cardsRouter;
