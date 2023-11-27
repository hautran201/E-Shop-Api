const mongoose = require('mongoose');

const mongoDbConnection = async () => {
    try {
        await mongoose
            .connect(process.env.MONGODB_URL, {
                useUnifiedTopology: true,
            })
            .then((data) => {
                console.log(
                    'Connected to MongoDB with ' + data.connection.host,
                );
            });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = mongoDbConnection;
