const express = require('express');
const upload = require('../configs/multer');
const { register } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', upload.single('avatar'), register);

module.exports = router;
