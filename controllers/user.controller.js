const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../models/user.model');

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new ErrorHandler("User doesn't exists", 400));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 500));
    }
};
