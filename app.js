// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {celebrate, Joi} = require('celebrate');
const {errors} = require('celebrate');

const {login, createUser} = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./error/NotFoundError');
const errCode = require('./const');

const app = express();

app.use(cookieParser());

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log('Connected to MongoDB!!!');
});

app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
    // eslint-disable-next-line max-len
    // avatar: Joi.string().uri({ scheme: /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig }),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    userId: Joi.string().alphanum(),
  }),
}), login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  try {
    throw new NotFoundError('Страница не найдена');
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(errCode.NotFoundError).send({message: err.message});
    }
  }
});

app.use(errors());
app.use(error);

app.listen(3000);
