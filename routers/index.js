const authRouter = require('./auth.route');
const userRouter = require('./user.route');

function Router(app) {
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/auth', authRouter);
}

module.exports = Router;
