'use strict';

var mongoose = require('mongoose'),
	bcrypt = require('bcryptjs');
var Date = require('../date/date.model');

var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    totalScore: Number,
    publicStatus: Boolean,
    dates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Date'
    }]
});

userSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isValid) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

userSchema.methods.updateTotalScore = function(callback) {
    var self = this;
    return new Promise(function(resolve, reject) {
        Date.find({_author: self._id}, function(error, dates) {
            if (error) {
                reject(error);
            } else {
                var totalScore = 0;
                for (var i = 0; i < dates.length; i++) {
                    totalScore += dates[i].score;
                }
                resolve(totalScore);
            }
        });
    }).then(function(totalScore) {
        self.model('User').findOneAndUpdate({
            _id: self._id
        }, {
            $set: {totalScore: totalScore}
        }, {
            new: true
        }, function(error, user) {
            if (error) {
                callback(error);
            } else {
                callback(null, user);
            }
        });
    }).catch(function(error) {
        callback(error);
    })
};

module.exports = mongoose.model('User', userSchema);