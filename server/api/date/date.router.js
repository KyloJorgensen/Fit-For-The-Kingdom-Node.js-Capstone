'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./date.controller');
var authenticateLogin = require('../../middleware/authenticateLogin');

router.get('/users', authenticateLogin, controller.getUserDates)
	.get('/:dateId', authenticateLogin, controller.getDate)
	.post('/', authenticateLogin, controller.createDate)
	.put('/', authenticateLogin, controller.updateDate)
	.delete('/', authenticateLogin, controller.deleteDate)

module.exports = router;