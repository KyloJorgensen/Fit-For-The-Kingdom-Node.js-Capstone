'use strict';

var User = require('../user/user.model'),
	Date = require('./date.model');

function DateController() {};

// get dates by userId and returns them to client
DateController.prototype.getUserDates = function(req, res, next) {
	return new Promise(function(resolve, reject) {
		Date.find({_author: req.user._id}, function(error, dates) {
			if (error) {
				reject(error);
			} else {
				resolve(dates);
			}
		});
	}).then(function(dates) {
		res.status(200).json(dates);
	}).catch(function(error) {
		next(error);
	});
};

// get date by dateId and returns it to client
DateController.prototype.getDate = function(req, res, next) {
	return new Promise(function(resolve, reject) {
		Date.findOne({_id: req.params.dateId, _author: req.user._id}, function(error, date) {
			if (error) {
				reject(error);
			} else {
				resolve(date);
			}
		});
	}).then(function(date) {
		res.status(200).json(date);
	}).catch(function(error) {
		next(error);
	});
};

// creates a new date for a user
DateController.prototype.createDate = function(req, res, next) {
	return new Promise(function(resolve, reject) {
		Date.find({
			_author: req.user._id
		}, function(error, dates) {
			if (error) {
				reject(error);
			} else {
				resolve(dates);
			}
		});
	}).then(function(dates) {
		// checks if date is already being used by that user
		if (!req.body.date) {
			var error = new Error('missing date in body');
			error.code = 400;
			return next(error);
		}

		for (var i = 0; i < dates.length; i++) {
			console.log(dates[i].date, req.body.date);
			if (dates[i].date === req.body.date) {
				var error = new Error('Date Already Exsites');
				error.code = 403;
				return next(error);
			}
		}
		return new Promise(function(resolve, reject) {
	    	var date = {
			    _author: req.user._id,
			    date: req.body.date,
			    exercise: 0,
			    sugar: false,
			    soda: false,
			    healthyChoice: 0,
			    satisfied: 0,
			    score: 0
	    	};
	    	// creates date
	    	Date.create(date, function(err, date) {
	            if (err) {
	           		reject(err);
	            } else {
					resolve(date);
				}
	    	});
	    }).then(function(date) {
	    	res.status(201).json(date);
	    }).catch(function(err) {
	    	next(err);
	    });
	}).catch(function(error) {
		next(error);
	});
};

// updates date and returns new user
DateController.prototype.updateDate = function(req, res, next) {
	return new Promise(function(resolve, reject) {
		var newDate = {};
	
		newDate.exercise = req.body.date.exercise;
		newDate.sugar = req.body.date.sugar;
		newDate.soda = req.body.date.soda;
		newDate.healthyChoice = req.body.date.healthyChoice;
		newDate.satisfied = req.body.date.satisfied;

		var score = 0;
		var all = true;
	
		newDate.exercise > 0 ? score += newDate.exercise * 2 : all = false ;
		newDate.sugar ? score += 2 : all = false ;
		newDate.soda ? score += 2 : all = false ;
		newDate.healthyChoice > 0 ? score += newDate.healthyChoice : all = false ;
		
		score += newDate.satisfied;
		newDate.satisfied == 3 ? '' : all = false ;
		all == true ? score *= 2 : '';

		newDate.score = score;

		Date.findOneAndUpdate({
			_id: req.body.date._id
		}, {
			$set: newDate
		}, {
			new: true
		}, function(error, date) {
			if (error) {
				reject(error);
			} else {
				resolve(date);
			}
		});
	}).then(function(date) {
		User.findOne({
			_id: date._author
		}, function(error, user) {
			if (error) {
				next({error: error});
			} else {
				user.updateTotalScore(function(error, user) {
					if (error) {
						next({error: error});
					} else {
				        user['username'] = undefined;
				        user['password'] = undefined;
						res.json(user);
					}
				});
			}
		});
	}).catch(function(error) {
		next({error: error});
	});
};

// delete date and returns new user
DateController.prototype.deleteDate = function(req, res, next) {
	return new Promise(function(resolve, reject) {
		Date.findOneAndRemove({
			_id: req.body.dateId
		}, function(error, date) {
			if (error) {
				reject(error);
			} else {
				resolve(date);
			}
		});
	}).then(function(date) {
		User.findOne({
			_id: date._author
		}, function(error, user) {
			if (error) {
				next({error: error});
			} else {
				user.updateTotalScore(function(error, user) {
					if (error) {
						next({error: error});
					} else {
				        user['username'] = undefined;
				        user['password'] = undefined;
						res.status(200).json(user);
					}
				});
			}
		});
	}).catch(function(error) {
		next({error: error});
	});
};

module.exports = DateController.prototype;