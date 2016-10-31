# Fit For The Kingdom
	
# SUMMARY
This app was made to be a fun and competitive place to track you healthy habits from exercise to eating. Allowing users to compare scores with others using the web site. Users make daily entries of their health habits and their scores are updated.
	
# DEMO 
This is an active demo of website hosted by a server.
[https://fit-for-the-kingdom-nodejs-cap.herokuapp.com/](https://fit-for-the-kingdom-nodejs-cap.herokuapp.com/)

# TECHNOLOGIES USED

The front-end is built using Knockout, the back-end using NodeJS with ExpressJS as the web server and MongoDB as the database.

Javascript file is full of Javascript libraries called modules from NPM (Node package Manager). 

Backend is Test with Mocha, Chai and Travis CI. [Click here to see test results](https://travis-ci.org/KyloJorgensen/Fit-For-The-Kingdom-Node.js-Capstone)

## Modules:

atob, bcryptjs, body-parser, btoa, chai, chai-http, express, express-passport-logout, jquery, knockout, mocha, and mongoose
   
    
# SCREENSHOTS
## Main Page
![Main Page](https://raw.githubusercontent.com/KyloJorgensen/Fit-For-The-Kingdom-Node.js-Capstone/master/screenshots/Screen%20Shot%202016-10-28%20at%2011.14.30%20AM.png)
## Login Page
![Login Page](https://raw.githubusercontent.com/KyloJorgensen/Fit-For-The-Kingdom-Node.js-Capstone/master/screenshots/Screen%20Shot%202016-10-28%20at%2011.14.39%20AM.png)
## Signup Page
![Signup Page](https://raw.githubusercontent.com/KyloJorgensen/Fit-For-The-Kingdom-Node.js-Capstone/master/screenshots/Screen%20Shot%202016-10-28%20at%2011.14.44%20AM.png)
## User Page
![User Page](https://raw.githubusercontent.com/KyloJorgensen/Fit-For-The-Kingdom-Node.js-Capstone/master/screenshots/Screen%20Shot%202016-10-28%20at%2011.15.04%20AM.png)
## New Date Page
![New Date Page](https://raw.githubusercontent.com/KyloJorgensen/Fit-For-The-Kingdom-Node.js-Capstone/master/screenshots/Screen%20Shot%202016-10-28%20at%2011.15.11%20AM.png)
## Edit Date Page
![Edit Date Page](https://raw.githubusercontent.com/KyloJorgensen/Fit-For-The-Kingdom-Node.js-Capstone/master/screenshots/Screen%20Shot%202016-10-28%20at%2011.15.18%20AM.png)

# API

## MAIN ENDPOINT

GET HTML FILE

	method: get
	path: /
	returns: html file

## USER ENDPOINT

GET ALL USER NAMES

	method: get
	path: /user/all
	returns: array of users names

GET A USER

	headers: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: get
	path: /user
	returns: User

CREATE A USER

	method: post
	path: /user
	body: 
	      required: username, password, and name
	returns: User


DELETE A USER

	method: delete
	path: /user/:userId/:password
	body: 
	      required: _characterId, and _id
	returns: {message: 'delete ' + username}

UPDATE A USER PUBLIC STATUS

	headers: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: put
	path: /user/publicStatus
	body: 
	      required: _characterId, and _id
	      Optional: name, type, check_penalty, spell_failure, weight, properties, and/or max_dex_bonus
	returns: User

LOGIN USER

	headers: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: post
	path: /user/login
	returns: User

## DATE ENDPOINT

GET ALL USER DATES

	header: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: get
	path: /date/users
	returns: array of dates

GET A DATE

	headers: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: get
	path: /date/:dateId
	returns: date

CREATE A DATE

	headers: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: post
	path: /date
	body: 
	      required: date: "00/00/0000"
	returns: date

UPDATE A DATE

	headers: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: put
	path: /date
	body: 
	      required: _id, _author, exercise, healthyChoice, satisfied, sugar, and soda
	returns: User

DELETE A USER

	headers: "Authorization": "Basic " + b64EncodeUnicode(username:password)
	method: delete
	path: /date
	body: 
	      required: dateId
	returns: User
