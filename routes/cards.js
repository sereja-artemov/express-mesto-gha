const cardsRouter = require('express').Router();
const { createCardValidation, cardIdValidation } = require('../middlewares/validations');

const {
  getAllCards, createCard, delCard, addLikeCard, removeLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createCardValidation, createCard);
cardsRouter.delete('/:cardId', cardIdValidation, delCard);
cardsRouter.put('/:cardId/likes', cardIdValidation, addLikeCard);
cardsRouter.delete('/:cardId/likes', cardIdValidation, removeLikeCard);

module.exports = cardsRouter;
