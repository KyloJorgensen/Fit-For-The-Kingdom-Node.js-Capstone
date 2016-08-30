'use strict';

var User = require('../user/user.model');

function LoginController() {};

LoginController.prototype.login = function(req, res) {
	console.log(req.body || 'hello');
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
				res.status(400).json(err);
			} else {
				if (isVaild) {
					res.status(200).json(user);
				} else {
					res.status(300).json({message: 'wrong password'});
				}
			}
		});
	}).catch(function(error) {
		res.status(400).json(error);
	})

	res.status(200).end();
};

module.exports = LoginController.prototype;