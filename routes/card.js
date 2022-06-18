const router = require('express').Router();
const {
  getCard, createCard, deleteCard, setLikeCard, deleteLikeCard,
} = require('../controllers/card');

router.get('/cards', getCard);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', setLikeCard);
router.delete('/cards/:cardId/likes', deleteLikeCard);

module.exports = router;
