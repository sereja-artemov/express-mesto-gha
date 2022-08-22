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
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
