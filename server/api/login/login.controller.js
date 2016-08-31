'use strict';

var User = require('../user/user.model');

function LoginController() {};

LoginController.prototype.login = function(req, res) {
	return new Promise(function(resolve, reject) {
		User.findOne({
			username: req.body.username
		}, function(error, user) {
			if (error) {
				reject(error);
			} else {
				resolve(user);
			}
		});
	}).then(function(user) {
		user.validatePassword(req.body.password, function(err, isVaild) {
			if (err) {
				console.log(err);
				res.status(400).json(err);
			} else {
				if (isVaild) {
					res.status(200).json(user);
				} else {
					console.log('wrong password');
					res.status(300).json({message: 'wrong password'});
				}
			}
		});
	}).catch(function(error) {
		console.log(error);
		res.status(400).json(error);
	});
};

module.exports = LoginController.prototype;