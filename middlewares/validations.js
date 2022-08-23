const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
const ValidationError = require('../error/ValidationError');

const checkValidUrl = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new ValidationError('Неправильный URL');
};

const signupValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkValidUrl),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const getUserValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const patchUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(checkValidUrl),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
});

const patchAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(checkValidUrl),
  }),
});

module.exports = {
  signupValidation,
  signinValidation,
  getUserValidation,
  patchUserValidation,
  createCardValidation,
  cardIdValidation,
  patchAvatarValidation,
};
