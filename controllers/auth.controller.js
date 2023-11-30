const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const ErrorHandler = require('../utils/ErrorHandler');
const sendMail = require('../utils/sendMail');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userEmail = await User.findOne({ email });
        if (userEmail) {
            const filename = req.file.filename;
            const filePath = `public/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error deleting file' });
                } else {
                    res.json({ message: 'Deleted file successfully' });
                }
            });

            return next(new ErrorHandler('User already exits!'));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const user = {
            name,
            email,
            password,
            avatar: fileUrl,
        };

        const activationToken = createActivationToken(user);
        const activationUrl = `http://localhost:3000/activation/${activationToken}`;

        try {
            await sendMail({
                email: user.email,
                subject: 'Activate your account',
                message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            });

            const newUser = await User.create(user);

            res.status(201).json({
                success: true,
                message: `please check your email:- ${user.email} to activate your account!`,
            });
        } catch (err) {
            return next(new ErrorHandler(err.message, 500));
        }
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
};

//createActivationToken
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: '5m',
    });
};
