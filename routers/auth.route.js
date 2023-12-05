const express = require('express');
const upload = require('../configs/multer');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors.middleware');
const {
    register,
    activateUser,
    login,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', upload.single('avatar'), register);

router.post('/activation', catchAsyncErrors(activateUser));

router.post('/login', login);

module.exports = router;
