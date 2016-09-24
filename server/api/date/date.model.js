'use strict';

var mongoose = require('mongoose');
var User = require('../user/user.model');

var dateSchema = mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    date: {
        type: String,
        require: true
    },
    exercise: Number,
    sugar: Boolean,
    soda: Boolean,
    healthyChoice: Number,
    satisfied: Number,
    score: Number
});

module.exports = mongoose.model('Date', dateSchema);