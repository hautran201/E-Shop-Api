const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();

const ErrorHandler = require('./utils/ErrorHandler');

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

//config
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config();
}

//It's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
