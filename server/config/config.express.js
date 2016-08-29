'use strict';

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser');

module.exports = function(app) {

    app.set('root', path.join(__dirname , "../.."));
    app.use(bodyParser.json());    
    app.use(bodyParser.urlencoded({
		extended: false
    }));
    app.use('/public', express.static(app.get('root') +  '/public'));
    app.use('/libs', express.static(app.get('root') + '/node_modules'));

};