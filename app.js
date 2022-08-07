const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

app.use(express.json());
app.use('/users', usersRouter);

app.listen(3000);
