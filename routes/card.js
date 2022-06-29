const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, createCard, deleteCard, setLikeCard, deleteLikeCard,
} = require('../controllers/card');

router.get('/cards', getCard);
router.post('/cards', createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), setLikeCard);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
}), deleteLikeCard);

module.exports = router;
