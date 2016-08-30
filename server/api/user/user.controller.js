'use strict';
var Date = require('../date/date.model'),
    User = require('./user.model'),
    bcrypt = require('bcrypt');

function UserController() {};

UserController.prototype.getUsers = function(req, res) {
    return new Promise(function(resolve, reject) {
        User.find({}, function(error, users) {
            if (error) {
                reject(error);
            } else {
                resolve(users);
            }
        });
    }).then(function(users) {
        res.status(200).json(users);
    }).catch(function(error) {
        console.log(error);
        res.status(500).json(error);
    });
};

UserController.prototype.getUser = function(req, res) {
    return new Promise(function(resolve, reject) {
        User.findOne({
            _id: req.params.userId
        }, function(error, user) {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    }).then(function(user) {
        res.status(200).json(user);
    }).catch(function(error) {
        console.log(error);
        res.status(500).json(error);
    });
};

UserController.prototype.createUser = function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    if (!('name' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: name'
        });
    }

    var name = req.body.name;

    if (typeof name !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: name'
        });
    }

    if (name === '') {
        return res.status(422).json({
            message: 'Incorrect field length: name'
        });
    }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            console.log(salt, hash);
            return new Promise(function(resolve, reject) {
                User.create({
                    username: username,
                    password: hash,
                    name: name, 
                    totalScore: 0
                }, function(error, user) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(user);
                    }
                })
            }).then(function(user) {
                console.log(user);
                res.status(201).json(user);
            }).catch(function(error) {
                console.log(error);
                res.status(500).json({error: error});
            });
        });
    });
};

UserController.prototype.deleteUser = function(req, res) {
	return new Promise(function(resolve, reject) {
        User.findOneAndRemove({_id: req.params.userId}, function(error, user) {
            if (error) {
                reject(error);
            } else {
                return new Promise(function(resolve, reject) {
                    Date.find({_author: req.params.userId}).remove(function(error, dates){
                        if (error) {
                            reject(error);
                        } else {
                            resolve(dates);
                        }
                    });
                }).then(function(dates) {
                    resolve(user);
                }).catch(function(error) {
                    reject(error);
                });
            }
        });
    }).then(function(user) {
        res.status(200).json(user);
    }).catch(function(error) {
        console.log(error);
        res.status(500).json(error);
    });
};

module.exports = UserController.prototype;