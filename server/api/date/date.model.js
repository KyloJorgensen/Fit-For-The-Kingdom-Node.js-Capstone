'use strict';

var mongoose = require('mongoose');


var dateSchema = mongoose.Schema({
    _author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: String,
    exercise: Number,
    sugar: Boolean,
    soda: Boolean,
    healthyChoice: Number,
    satisfied: Number,
    score: Number
});

module.exports = mongoose.model('Date', dateSchema);