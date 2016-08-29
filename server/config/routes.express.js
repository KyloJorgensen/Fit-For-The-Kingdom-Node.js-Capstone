var mainRouter = require('../api/main/main.router');
	// userRouter = require('../api/user/user.router'),
	// dateRouter = require('../api/date/date.router');

module.exports = function(app) {
    app.use('/', mainRouter);
    // app.use('/user', userRouter);
    // app.use('/date', dateRouter);
};