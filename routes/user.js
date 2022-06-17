const router = require('express').Router();
const { getUser, getUserByID, createUser } = require('../controllers/user');

router.get('/users', getUser);
router.get('/users/:userId', getUserByID);
router.post('/users', createUser);

module.exports = router;