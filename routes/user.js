const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUserByID, updateUser, updateAvatar, getProfileUser,
} = require('../controllers/user');

router.get('/users', getUser);
router.get('/users/me', getProfileUser);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), getUserByID);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), updateAvatar);

module.exports = router;
