'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');


router.get('/', controller.getUsers)
    .get('/:userId', controller.getUser)
    .post('/', controller.createUser)
    .delete('/:userId/:password', controller.deleteUser)
    .put('/publicStatus', controller.updatePublicStatus)

module.exports = router;