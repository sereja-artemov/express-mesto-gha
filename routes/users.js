const usersRouter = require('express').Router();

const {
  getCurrentUser,
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);
usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
