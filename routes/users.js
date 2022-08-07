const usersRouter = require('express').Router();

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
