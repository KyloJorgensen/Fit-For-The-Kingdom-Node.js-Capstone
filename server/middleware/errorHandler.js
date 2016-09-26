'use strict';

var express = require('express');

module.exports = function(app) {
	app.use(function(error, req, res, next) {
		if (error) {
			console.log(error);
			// return res.status(299).json(error);
			next(error);
		} else {
			res.status(500).json('missing error');
		}
	});
	app.use(function(error, req, res, next) {
		if (res.headerSent) {
			return next(error);
		}

		if (error.code) {
			res.status(error.code);
		} else {
			res.status(500);
		}

		if (error.message) {
			return res.json(error.message);
		} else {
			return res.json('missing message');
		}

		console.error('Server Error: ', error);
		res.status(500).json({'error': error});
	});
};