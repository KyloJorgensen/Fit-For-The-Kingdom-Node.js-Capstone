'use strict';

var express = require('express');

module.exports = function(app) {
	app.use(function(error, req, res, next) {
		if (res.headerSent) {
			return next(error);
		}
		if (error.status >= 400 && error.status < 500) {
			var statusResponse = 'Bad Request';
			if (error.status == 401) {
				statusResponse = 'Unauthorized';
			} else if (error.status == 404) {
				statusResponse = 'Not Found';
			}
			return res.status(error.status).json('Operational Error: ' + statusResponse);
		}
		console.error('Server Error: ', error);
		res.status(500).json({'error': error});
	});
};