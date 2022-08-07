const usersRouter = require('express').Router();
// const UserModel = require('../models/user');
//
// router.get('/users', (req, res) => {
//   UserModel.find({})
//     .then(usersData => res.send({ data: usersData }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// });
//
// router.get('/users/:userId', (req, res) => {
//   // eslint-disable-next-line no-underscore-dangle
//   UserModel.findById(req.params._id)
//     .then(user => res.send({ data: user }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// });
//
// router.post('/users', (req, res) => {
//   const { name, about, avatar } = req.body;
//
//   UserModel.create({ name, about, avatar })
//     .then(user => res.send({ data: user }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// });
//
// module.exports = router;

// const { createUser, getAllUsers, getUser } = require('../controllers/users');
const { createUser, getAllUsers, getUser } = require('../controllers/users');

usersRouter.post('/', createUser);
usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);

module.exports = usersRouter;
