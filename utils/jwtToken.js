const jwt = require('jsonwebtoken');

exports.generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRIES,
    });
};

//createActivationToken
exports.createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: '5m',
    });
};
