const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const ErrorHandler = require('../utils/ErrorHandler');
const sendMail = require('../utils/sendMail');
const { generateToken, createActivationToken } = require('../utils/jwtToken');

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

exports.activateUser = async (req, res, next) => {
    try {
        const { activate_user } = req.body;

        const newUser = jwt.verify(
            activate_user,
            process.env.ACTIVATION_SECRET,
        );
        console.log(newUser);

        if (!newUser) {
            return next(new ErrorHandler('Invalid token', 400));
        }

        const { name, email, password, avatar } = newUser;

        let user = await User.findOne({ email });
        console.log(user);
        if (user) {
            return next(new ErrorHandler('User already exits', 400));
        }

        user = await User.create({ name, email, password, avatar });

        const token = generateToken(user._id);

        res.cookie('token', token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.status(201).json({
            success: true,
            user,
            token,
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 500));
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(
                new ErrorHandler('Please provide the all fields!', 400),
            );
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler("User doest'n exits", 400));
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(
                new ErrorHandler('Please provide the correct information', 400),
            );
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.status(201).json({
            success: true,
            user,
            token,
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 500));
    }
};
