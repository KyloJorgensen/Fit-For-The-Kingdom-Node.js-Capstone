'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var authenticateLogin = require('../../middleware/authenticateLogin');

router.get('/all', controller.getUsers)
    .get('/', authenticateLogin, controller.getUser)
    .post('/', controller.createUser)
    .post('/login', authenticateLogin, controller.login)
    .delete('/:userId/:password', controller.deleteUser)
    .put('/publicStatus', authenticateLogin, controller.updatePublicStatus)

module.exports = router;