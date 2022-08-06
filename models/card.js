const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: ObjectId,
    default: [],
  },
  createdAt: {
    type: date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
