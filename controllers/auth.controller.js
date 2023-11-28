const path = require('path');

const userModel = require('../models/user.model');
const ErrorHandler = require('../utils/ErrorHandler');

exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    const userEmail = await userModel.findOne({ email });
    if (userEmail) {
        return next(new ErrorHandler('User already exits!'));
    }

    if (!req.file) {
        return next(new ErrorHandler('Please enter avatar', 400));
    }
    const filename = req.file.filename;

    const user = {
        name,
        email,
        password,
        ...req.body,
    };

    res.send(user);
};
