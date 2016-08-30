var mainRouter = require('../api/main/main.router'),
	userRouter = require('../api/user/user.router'),
	dateRouter = require('../api/date/date.router'),
	loginRouter = require('../api/login/login.router');

module.exports = function(app) {
    app.use('/', mainRouter);
    app.use('/user', userRouter);
    app.use('/date', dateRouter);
    app.use('/login', loginRouter);
};