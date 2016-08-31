'use strict';

var mongoose = require('mongoose'),
	bcrypt = require('bcryptjs');

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
    name: String,
    totalScore: Number,
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

module.exports = mongoose.model('User', userSchema);