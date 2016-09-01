'use strict';

var Utility = require('../utility/utility');

function LoginController() {};

// attempts to login 
LoginController.prototype.login = function(req, res) {
	Utility.validateLoggedIn(req, res, function(user) {
		res.status(200).json(user);
	});
};

module.exports = LoginController.prototype;