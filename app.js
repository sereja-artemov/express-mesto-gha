const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundErr = require('./error/NotFound');
const errCode = require('./const');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

app.use((req, res, next) => {
  req.user = { _id: '62efd700628f2548788b5e17' };

  next();
});

app.use(express.json());
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  try {
    throw new NotFoundErr('Страница не найдена');
  } catch (err) {
    if (err instanceof NotFoundErr) {
      res.status(errCode.NotFoundError).send({ message: err.message });
    }
  }
});

app.listen(3000);
