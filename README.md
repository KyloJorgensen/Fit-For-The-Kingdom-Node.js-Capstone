# Fit-For-The-Kingdom-Node.js-Capstone

API Documentation

/ sends user html file

/user 
  .get request will return array of users
  .post request with body {username: asdfghjk, password: ******, name: asdffghj} return obj of user of new user

/user/:userId
  .get request will return obj of user
  
/user/:userId/:password
  .delete request with userID and delete password in params with delete user and all of their dates

/user/publicStatus
  .put request with body {user: {username: asdffghj, password: *********}, boolean} will return user changing the public status

/login
  .post request with body {user: {username: asdffghk, password: ********}} will return user
  
/date/users/:userId 
  .get request with UserID in params will return all of the dates of that user
  
/date/date/:dateID
  .get request with DateID in params will return date of matching Id
  
/date 
  .post request with body{user: {username: asdffghjk, password: *******}, date} will return date that was created 
    date needs to be string.
  
  .put request with body{user: {username: asdffghjk, password: *******}, date: {}} will return user
    date needs to be an object with _id, _author, exercise, healthyChoice, satisfied, sugar, soda properties.
    
  .delete request with with body{user: {username: asdffghjk, password: *******}, dateId: asdfghjl}} will return user

This is desired for the purpose of tracking possitive health habits. A user can sign up and later login in and out to their profile. When a user is logged in can view all of their daily entries of their habits, add new dates, delete dates, edit dates, and change if there name and score are viewable by other users.

technology used.

Javascript, css, html
jquery, and knockout
node.js for back end server
express, bcryptjs, body-paser as server modules
node package manager
mongo with mongoose for database
mocha with chai and chai-http and Tarvis-CI for testing

