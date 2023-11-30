const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const handleError = require('./middlewares/error.middleware');
const Router = require('./routers');

//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

//config cors
var corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));

//config
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config();
}

app.use('/public', express.static(path.join(__dirname, 'public')));

Router(app);

//It's for ErrorHandling
app.use(handleError);

module.exports = app;
