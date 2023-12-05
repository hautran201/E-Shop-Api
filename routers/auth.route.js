const express = require('express');
const upload = require('../configs/multer');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors.middleware');
const { register, activateUser } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', upload.single('avatar'), register);

router.post('/activation', catchAsyncErrors(activateUser));

module.exports = router;
