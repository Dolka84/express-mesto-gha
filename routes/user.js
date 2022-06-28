const router = require('express').Router();
const {
  getUser, getUserByID, updateUser, updateAvatar, getProfileUser,
} = require('../controllers/user');

router.get('/users', getUser);
router.get('/users/:userId', getUserByID);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/me', getProfileUser);

module.exports = router;
