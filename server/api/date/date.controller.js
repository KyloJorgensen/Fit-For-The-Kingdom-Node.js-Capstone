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
		var errorMessage = false;

		if (req.body.exercise == undefined) {
			errorMessage = 'Missing body exercise';
		} else if (req.body.sugar == undefined) {
			errorMessage = 'Missing body sugar';
		} else if (req.body.soda == undefined) {
			errorMessage = 'Missing body soda';
		} else if (req.body.healthyChoice == undefined) {
			errorMessage = 'Missing body healthyChoice';
		} else if (req.body.satisfied == undefined) {
			errorMessage = 'Missing body satisfied';
		} else if (req.body._id == undefined) {
			errorMessage = 'Missing body _id';
		} else if (req.body._author == undefined) {
			errorMessage = 'Missing body _author';
		}

		var score = 0;
		var all = true;

		req.body.sugar ? score += 2 : all = false ;
		req.body.soda ? score += 2 : all = false ;

		if (req.body.exercise < 0) {errorMessage = 'exercise cannot be below 0'} 
		req.body.exercise > 0 ? score += Number(req.body.exercise) * 2 : all = false ;

		if (req.body.healthyChoice < 0) {errorMessage = 'healthyChoice cannot be below 0'}
		req.body.healthyChoice > 0 ? score += Number(req.body.healthyChoice) : all = false ;

		if (req.body.satisfied > 3 || req.body.satisfied < 0) {
			errorMessage = 'Satisfied need to between 0 and 3';
		}
		score += Number(req.body.satisfied);
		req.body.satisfied == 3 ? '' : all = false ;

		all == true ? score *= 2 : '';

		var newDate = req.body;
		newDate.score = score;

		if (errorMessage) {
			var error = new Error(errorMessage);
			error.code = 400;
			return next(error);
		}

		Date.findOneAndUpdate({
			_id: req.body._id
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
				next(error);
			} else {
				user.updateTotalScore(function(error, user) {
					if (error) {
						next(error);
					} else {
						res.json(user);
					}
				});
			}
		});
	}).catch(function(error) {
		next(error);
	});
};

// delete date and returns new user
DateController.prototype.deleteDate = function(req, res, next) {
	if (!req.body.dateId) {
		var error = new Error('Missing body dateId')
		error.code = 400;
		return next(error);
	}
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
				next(error);
			} else {
				user.updateTotalScore(function(error, user) {
					if (error) {
						next(error);
					} else {
						res.status(200).json(user);
					}
				});
			}
		});
	}).catch(function(error) {
		next(error);
	});
};

module.exports = DateController.prototype;