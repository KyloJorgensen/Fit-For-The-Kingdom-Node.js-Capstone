'use strict';

module.exports = function(app) {
	app.use(function(error, req, res, next) {
		if (error) {
			next(error);
		} else {
			res.status(500).json('missing error');
		}
	});
	app.use(function(error, req, res, next) {
		if (res.headerSent) {
			return next(error);
		}
		
		if (error.name == 'ValidationError') {
			res.status(400);
		} else if (error.name == 'MongoError') {
			if (error.code == 11000) {
				res.status(403);
				return res.json('User name already exsists');
			} 
		} else if (error.name == 'CastError') {
			res.status(400);
		} else if (error.code) {
			res.status(error.code);
		} else if (error.message == 'Illegal arguments: undefined, string') {
			res.status(400);
		} else {
			res.status(500);
		}

		if (error.message) {
			return res.json(error.message);
		} else {
			return res.json('missing message');
		}

		next(error)
	});
	app.use(function(error, req, res, next) {
		console.log('CRITICAL ERROR: ', error);
	})
};