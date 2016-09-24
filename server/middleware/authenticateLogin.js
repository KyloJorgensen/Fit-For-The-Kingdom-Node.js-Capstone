'use strict';
var atob = require('atob');
var User = require('../api/user/user.model');

module.exports = function authenticate(req, res, next) {
  var auth = req.headers.authorization;

  if (!auth) {
    return next({message: 'missing authention'});
  }

  var splitAuth = auth.split(' ');
  var decodedAuth = atob(splitAuth[1]).split(':');
  var username = decodedAuth[0];
  var password = decodedAuth[1];

  return new Promise(function(resolve, reject) {
    User.findOne({
      username: username
    }, function(error, user) {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  }).then(function(user) {
    if (!user) {
      return next({message: 'Bad Username', status: 401})
    }
    user.validatePassword(password, function(err, isVaild) {
      if (err) {
        next({error: err});
      } else {
        if (isVaild) {
          req.user = user;
          next();
        } else {
          next({message: 'Bad Password', status: 401});
        }
      }
    });
  }).catch(function(error) {
      next({error: error});
  });
};