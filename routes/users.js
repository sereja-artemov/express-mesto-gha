const usersRouter = require('express').Router();
const { getUserValidation, patchUserValidation, patchAvatarValidation } = require('../middlewares/validations');

const {
  getCurrentUser,
  getAllUsers,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

usersRouter.get('/me', getCurrentUser);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUserValidation, getUser);
usersRouter.patch('/me', patchUserValidation, updateUser);
usersRouter.patch('/me/avatar', patchAvatarValidation, updateAvatar);

module.exports = usersRouter;
