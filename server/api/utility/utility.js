'use strict';

var User = require('../user/user.model'),
    Date = require('../date/date.model');

function UtilityFunctions() {};

// vailodates that user name and password are correct returns callback on success
UtilityFunctions.prototype.validateLoggedIn = function(req, res, callback) {
	return new Promise(function(resolve, reject) {
        User.findOne({
            username: req.body.user.username
        }, function(error, user) {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    }).then(function(user) {
        user.validatePassword(req.body.user.password, function(err, isVaild) {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            } else {
                if (isVaild) {
                    callback(user);
                } else {
                    console.log('Invald user');
                    res.status(400).json({message: 'Bad Username ande Password'});
                }
            }
        });
    }).catch(function(error) {
        console.log(error);
        res.status(400).json(error);
    });
};

// updates totalscore on user returns new user
UtilityFunctions.prototype.updateUserTotalScore = function(req, res, userId, callback) {
    return new Promise(function(resolve, reject) {
        Date.find({_author: userId}, function(error, dates) {
            if (error) {
                reject(error);
            } else {
                resolve(dates);
            }
        });
    }).then(function(dates){
        var totalScore = 0;
        for (var i = 0; i < dates.length; i++) {
            totalScore += dates[i].score;
        }
        return new Promise(function(resolve, reject) {
            User.findOneAndUpdate({
                _id: userId
            }, {
                $set: {totalScore: totalScore}
            }, {
                new: true
            }, function(err, user) {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            });
        }).then(function(user) {
            callback(user);
        }).catch(function(err) {
            console.log(err);
            res.status(500).json(err);
        });
    }).catch(function(error) {
        console.log(error);
        res.status(501).json(error);
    });
};

module.exports = UtilityFunctions.prototype;