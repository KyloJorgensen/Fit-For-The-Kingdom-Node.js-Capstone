'use strict';

var Model = function(self) {
	var that = this;
	this.user = {};

	// Gets array of public Users
	this.getUsers = function() {
		$.ajax({
	        url: '/user',
	        datatype: 'jsonp',
	        type: 'GET'
	    }).done(function(users) {
			self.updateUsers(users);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	// Gets user object
	this.getUser = function(userId) {
		$.ajax({
			type: 'GET',
			contentType: 'application/json',
			url: '/user/' + userId
		}).done(function(user) {
			self.generateUser(user);
		}).fail(function(error) {
			console.log(error);
		});
	};

	// gets array of users' dates
	this.getUserDates = function(user) {
		$.ajax({
		    type: 'GET',
		    contentType: 'application/json',
		    url: '/date/users/' + user._id
		}).done(function(date) {
	    	self.generateUserDates(date);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	// Creates A user
	// needs name, username and password for the new user
	this.createUser = function(name, username, password) {
		var data = {};
		data.name = name;
		data.username = username;
		data.password = password;

		$.ajax({
		    type: 'POST',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/user'
		}).done(function(user) {
	    	that.user = {username: username, password: password};
	    	self.login(user);
	    }).fail(function(error){
	        console.log(error);
	        that.user = {};
	    });
	};

	// post a login attempt
	this.validateLogin = function(username, password) {
		that.user = {username: username, password: password};
		var data = {};
		data.user = that.user;

		$.ajax({
		    type: 'POST',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/login'
		}).done(function(user) {
	    	self.login(user);
	    }).fail(function(error){
	    	if (error.code == 11000) {
	    		alert('Username already taken');
	    	} else {
	    		console.log(error);
	    	}
	        that.user = {};
	    });
	};

	// makes a request to change a user public status
	this.updateUserPublicStatus = function(publicStatus) {
		var data = {};
		data.user = that.user;
		data.publicStatus = publicStatus;

		$.ajax({
		    type: 'PUT',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/user/publicStatus'
		}).done(function(user) {
	    	self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	// gets date by dateId 
	this.getDate = function(dateId) {
		$.ajax({
		    type: 'GET',
		    contentType: 'application/json',
		    url: '/date/date/' + dateId
		}).done(function(date) {
	    	self.generateEditDate(date);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	// posts a request to create a new date
	this.createDate = function(date) {
		var data = {};
		data.date = date;
		data.user = that.user;
		$.ajax({
		    type: 'POST',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/date' 
		}).done(function(date) {
			self.editDate(date);
	    }).fail(function(error){
	    	if (error.readyState == 4) {
	    		alert(error.responseText);
	    	} else {
	    		console.log(error);
	    	}
	    });
	};

	// puts a request to update a date
	this.updateDate = function(date) {
		var data = {};
		data.date = date;
		data.user = that.user;
		$.ajax({
		    type: 'PUT',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/date'
		}).done(function(user) {
			self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	// delete request of date by dateId
	this.deleteUserDate = function(dateId) {
		var data = {};
		data.dateId = dateId;
		data.user = that.user;

		$.ajax({
		    type: 'DELETE',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/date'
		}).done(function(user) {
			self.generateUser(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};
};

var ViewModel = function(Model) {
	var self = this,
		model = new Model(self);

	this.users = ko.observableArray([]); 

	// calls users from model
	this.getUsers = function() {
		model.getUsers();
	};

	// takes array of users and diplays them
	this.updateUsers = function(users) {
		self.users.splice(0, self.users().length);
		for (var i = 0; i < users.length; i++) {
			self.users.push(users[i]);
		}
		self.generateWinnerStand();
		self.hideAllInMain();
		$('.users').show();
	};

	this.winnerstand = ko.observableArray([]);

	// generates the winners stand
	this.generateWinnerStand = function() {
		var winnerstand = [	{name: 'none', score: 0}, {name: 'none', score: 0}, {name: 'none', score: 0}];
		for (var i = 0; i < self.users().length; i++) {
			// finds the top score
			if (self.users()[i].totalScore >= winnerstand[0].score) {
				winnerstand[2].name = winnerstand[1].name;
				winnerstand[2].score = winnerstand[1].score;
				winnerstand[1].name = winnerstand[0].name;
				winnerstand[1].score = winnerstand[0].score;
				winnerstand[0].name = self.users()[i].name;
				winnerstand[0].score = self.users()[i].totalScore;
			// finds the second top score 
			} else if (self.users()[i].totalScore >= winnerstand[1].score) {
				winnerstand[2].name = winnerstand[1].name;
				winnerstand[2].score = winnerstand[1].score;
				winnerstand[1].name = self.users()[i].name;
				winnerstand[1].score = self.users()[i].totalScore;
			// finds the third top score 
			} else if (self.users()[i].totalScore >= winnerstand[2].score) {
				winnerstand[2].name = self.users()[i].name;
				winnerstand[2].score = self.users()[i].totalScore;
			}
		}

		self.winnerstand.splice(0, self.winnerstand().length);
		for (var i = 0; i < winnerstand.length; i++) {
			self.winnerstand.push(winnerstand[i]);
		}
	};

	// hides all in main so disired content they can be displayed
	this.hideAllInMain = function() {
		$('.toggle').hide();
	};

	this.currentUser = ko.observableArray([]);
	this.currentDates = ko.observableArray([]);

	// calls for Current User
	this.getUser = function() {
		model.getUser(self.currentUser()[0]._id);
	};

	// generates user
	this.generateUser = function(user) {
		self.currentUser.splice(0, self.currentUser().length);
		self.currentUser.push(user);
		self.updatePublicStatusDisplay(user.publicStatus);
		model.getUserDates(user);
		self.showUser();
	};

	// calls for a public status update oppsite of current status
	this.publicStatusClicked = function(user) {
		model.updateUserPublicStatus(!user.publicStatus);
	};

	this.publicStatusDisplay = ko.observable('Public');

	// updates the users public status display
	this.updatePublicStatusDisplay = function(publicStatus) {
		if (publicStatus) {
			self.publicStatusDisplay('Public');
		} else {
			self.publicStatusDisplay('Private');
		}
	};

	// displays current user
	this.showUser = function() {
		self.hideAllInMain();
		$('.user').show();
	};

	// displays array of users' dates 
	this.generateUserDates = function(dates) {
		self.currentDates.splice(0, self.currentDates().length);
		for (var i = 0; i < dates.length; i++) {
			self.currentDates.push(dates[i]);
		}
	};

	// displays sign up form
	this.showSignUp = function() {
		self.hideAllInMain();
		$('.signUp').show();
	};

	this.newUserName = ko.observable();
	this.newUserUsername = ko.observable();
	this.newUserPassword = ko.observable();
	this.newUserVerifyPassword = ko.observable();

	// validates the new user fields have content
	this.validateNewUser = function() {
		event.preventDefault();
		if (!self.newUserName()) {
			return alert('Missing field: Name');
		}
		if (!self.newUserUsername()) {
			return alert('Missing field: Username');
		}
		if (!self.newUserPassword()) {
			return alert('Missing field: Password');
		}
		if (!self.newUserVerifyPassword()) {
			return alert('Missing field: Password');
		}
		if (self.newUserPassword() == self.newUserVerifyPassword) {
			return alert('Passwords are no the same.');
		}

		model.createUser(self.newUserName(), self.newUserUsername(), self.newUserPassword());
	};

	this.userUsername = ko.observable('');
	this.userPassword = ko.observable('');

	// validate user name and password fields are filled
	this.validateLogin = function() {
		event.preventDefault();

		if (!self.userUsername()) {
			return alert('Username Required');
		}

		if (!self.userPassword()) {
			return alert('Password Required');
		}

		model.validateLogin(self.userUsername(), self.userPassword());
	};

	// dispalys logged in user
	this.login = function(user) {
		self.generateUser(user);
		$('.loggedIn').show();
		$('.loggedOut').hide();
	};

	// logs user out
	this.logout = function() {
		model.user = {};
		self.currentUser([]);
		self.getUsers();
		self.showLogout();
	};

	// show login form
	this.showLogin = function() {
		$('.toggle').hide();
		$('.login').show();
	};

	// displays logged out
	this.showLogout = function() {
		$('.loggedIn').hide();
		$('.loggedOut').show();
	};

	this.currentUserDate = ko.observableArray([]);
	this.date = ko.observable('11/11/2011');

	// requests date
	this.editDate = function(date) {
		model.getDate(date._id);
	};

	// displays date to edited
	this.generateEditDate = function(date) {
		self.hideAllInMain();
		$('.userDate').show();
		self.currentUserDate.splice(0, self.currentUserDate().length);
		self.currentUserDate.push(date);
	};

	// returns current date
	this.formattedDate = function() {
	    var d = new Date(Date.now()),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	};

	this.newUserDate = ko.observable(self.formattedDate());

	// shows add new date
	this.showAddDate = function() {
		self.hideAllInMain();
		$('.newUserDate').show();
	};

	// validate that new date field is good
	this.validateDate = function() {
		if (self.newUserDate()) {
			model.createDate(self.newUserDate());
		} else {
			alert('Need Month, Day, and Year (mm/dd/yyyy).')
		}
	};

	// request to delete date
	this.deleteUserDate = function() {
		var date = self.currentUserDate()[0];
		model.deleteUserDate(date._id);
	};

	// validate and edit fields are corect
	this.validateDateInputs = function() {
		event.preventDefault();

		self.currentUserDate()[0].exercise = Number(self.currentUserDate()[0].exercise);
		if (!(self.currentUserDate()[0].exercise >= 0 && typeof self.currentUserDate()[0].exercise === 'number')) {
			alert('exercise needs to be a number equal to or above 0');
			return;
		}

		self.currentUserDate()[0].healthyChoice = Number(self.currentUserDate()[0].healthyChoice);
		if (!(self.currentUserDate()[0].healthyChoice >= 0 && typeof self.currentUserDate()[0].healthyChoice === 'number')) {
			alert('healthyChoice needs to be a number above 0');
			return;
		}

		self.currentUserDate()[0].satisfied = Number(self.currentUserDate()[0].satisfied);
		if (!(self.currentUserDate()[0].satisfied >= 0 && self.currentUserDate()[0].satisfied <= 3 && typeof self.currentUserDate()[0].satisfied === 'number')) {
			alert('satisfied needs to be a number between 0 and 3');
			return;
		}

		if (self.currentUserDate()[0].soda == "true" || self.currentUserDate()[0].soda == true) {
			self.currentUserDate()[0].soda = true;
		} else if (self.currentUserDate()[0].soda == "false" || self.currentUserDate()[0].soda == false) {
			self.currentUserDate()[0].soda = false;
		} else {
			alert('soda needs to be true or false');
			return;
		}

		if (self.currentUserDate()[0].sugar == "true" || self.currentUserDate()[0].sugar == true) {
			self.currentUserDate()[0].sugar = true;
		} else if (self.currentUserDate()[0].sugar == "false" || self.currentUserDate()[0].sugar == false) {
			self.currentUserDate()[0].sugar = false;
		} else {
			alert('sugar needs to be true or false');
			return;
		}
		model.updateDate(self.currentUserDate()[0]);
	};

	// changes to sugar button from true to false and vis versa when clicked
	this.clickedSugar = function() {
		var currentDate = self.currentUserDate()[0];
		currentDate.sugar = !currentDate.sugar;
		self.currentUserDate.splice(0, self.currentUser().length);
		self.currentUserDate.push(currentDate);
	};
	
	// changes to soda button from true to false and vis versa when clicked
	this.clickedSoda = function() {
		var currentDate = self.currentUserDate()[0];
		currentDate.soda = !currentDate.soda;
		self.currentUserDate.splice(0, self.currentUser().length);
		self.currentUserDate.push(currentDate);
	};

	// when page loads calls for content to display
	model.getUsers(true);
};

ko.applyBindings(new ViewModel(Model));