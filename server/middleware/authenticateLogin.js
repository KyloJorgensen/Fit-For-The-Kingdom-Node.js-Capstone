'use strict';
var atob = require('atob');
var User = require('../api/user/user.model');

module.exports = function authenticate(req, res, next) {
  var auth = req.headers.authorization;

  if (!auth) {      
    var error = new Error('Missing Authentication');
    error.code = 401;
    return next(error);
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
      var error = new Error('Bad Username or Password');
      error.code = 401;
      return next(error);
    }
    user.validatePassword(password, function(err, isVaild) {
      if (err) {
        next(err);
      } else {
        if (isVaild) {
          req.user = user;
          next();
        } else {     
          var error = new Error('Bad Username or Password');
          error.code = 401;
          return next(error);
        }
      }
    });
  }).catch(function(error) {
      next(error);
  });
};