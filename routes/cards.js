const cardsRouter = require('express').Router();

const {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/', delCard);
cardsRouter.put('/:cardId/likes', addLikeCard);
cardsRouter.delete('/:cardId/likes', removeLikeCard);

module.exports = cardsRouter;
