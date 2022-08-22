const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().regex(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/).required().uri(),
  }),
}), updateAvatar);

module.exports = usersRouter;
