const app = require('./app');
const mongoDbConnection = require('./configs/connectDb');

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log('ERROR: ' + err.message);
    console.log('Shuting down the server for handling uncaught exception');
});

//config
if (process.env.NODE_ENV !== 'PRODUCTION') {
    require('dotenv').config();
}

//connect database
mongoDbConnection();

//create server
const server = app.listen(process.env.PORT, () => {
    console.log('Server is running on http://localhost:' + process.env.PORT);
});

//handling promise rejection
process.on('unhandledRejection', (err) => {
    console.log('Shutting down server for ' + err.message);
    console.log('Shutting down server for unhandle promise rejection');

    server.close(() => {
        process.exit(1);
    });
});
