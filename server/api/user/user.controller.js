'use strict';
var User = require('./user.model'),
    Date = require('../date/date.model'),
    bcrypt = require('bcryptjs'),
    logout = require('express-passport-logout');

function UserController() {};


// get public users and returns to client
UserController.prototype.getUsers = function(req, res, next) {
    return new Promise(function(resolve, reject) {
        User.find({}, function(error, users) {
            if (error) {
                reject(error);
            } else {
                resolve(users);
            }
        });
    }).then(function(users) {
        var publicUsers = [];
        // pushes users that are pubilc to a single array
        for (var i = 0; i < users.length; i++) {
            if (users[i].publicStatus) {
                publicUsers.push({name: users[i].name, totalScore: users[i].totalScore, user: users[i]});
            }
        }
        res.status(200).json(publicUsers);
    }).catch(function(error) {
        next({error: error});
    });
};

// gets a user by id and returns to client
UserController.prototype.getUser = function(req, res, next) {
    return res.status(200).json(req.user);   
};

// creates new user from username, password, name
UserController.prototype.createUser = function(req, res, next) {
    // validate all variable are correct
    if (!req.body) { 
        return res.status(400).json({message: "No request body"});
    }

    if (!('username' in req.body)) { 
        return res.status(422).json({message: 'Missing field: username'});
    }

    if (!('password' in req.body)) { 
        return res.status(422).json({message: 'Missing field: password'});
    }

    if (!('name' in req.body)) { 
        return res.status(422).json({message: 'Missing field: name'});
    }

    // generates the salt for bcrypt to encrypt the password
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        // generates encrypted password
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            return new Promise(function(resolve, reject) {
                // creates user useing username, encrypted password (hash), name
                User.create({
                    username: username,
                    password: hash,
                    name: name,
                    publicStatus: true,
                    totalScore: 0
                }, function(error, user) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(user);
                    }
                })
            }).then(function(user) {
                res.status(201).json(user);
            }).catch(function(error) {
                next({status: 400, message: 'username already used', error: error});
            });
        });
    });
};

UserController.prototype.login = function(req, res, next) {
    return res.status(200).json(req.user);
};

// deletes user
UserController.prototype.deleteUser = function(req, res, next) {
    if (req.params.password === 'sdfghuytrfgvhjiuqyghjuhgfde456789765r4fghbvfrt54rfgbnjkio98765rtghgft') {
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
            res.status(200).json({message: 'delete ' + user.username});
        }).catch(function(error) {
            next({error: error, status: 404});
        });
    } else {
        next({status: 400});
    }
};

// updates users Public status
UserController.prototype.updatePublicStatus = function(req, res, next) {
    return new Promise(function(resolve, reject) {
        User.findOneAndUpdate({
            _id: req.user._id
        },{
            $set: {publicStatus: req.body.publicStatus}
        }, {
            new: true
        }, function(error, user) {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    }).then(function(user) {
        res.status(202).json(user);
    }).catch(function(error) {
        next({error: error});
    });
};

module.exports = UserController.prototype;