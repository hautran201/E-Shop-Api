const express = require('express');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { getUser } = require('../controllers/user.controller');

const router = express.Router();

//load user
router.get('/', isAuthenticated, getUser);

module.exports = router;
