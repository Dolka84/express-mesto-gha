const router = require('express').Router();
const { getUser, getUserByID, createUser, updateUser, updateAvatar } = require('../controllers/user');

router.get('/users', getUser);
router.get('/users/:userId', getUserByID);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;