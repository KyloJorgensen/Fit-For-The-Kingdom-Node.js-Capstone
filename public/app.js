'use strict';

var Model = function(self) {
	var that = this;
	this.user = {};

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
	    });
	};

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

	this.deleteUser = function(userId) {
		$.ajax({
		    type: 'DELETE',
		    contentType: 'application/json',
		    url: '/user/' + userId
		}).done(function(users) {
	    	that.getUsers();
	    }).fail(function(error){
	        console.log(error);
	    });
	};

	this.deleteUserDate = function(userId, dateId) {
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

	this.validatelogin = function(username, password) {
		var data = {};
		data.username = username;
		data.password = password;

		$.ajax({
		    type: 'POST',
		    data: JSON.stringify(data),
		    contentType: 'application/json',
		    url: '/login'
		}).done(function(user) {
	    	that.user = {username: username, password: password};
	    	self.login(user);
	    }).fail(function(error){
	        console.log(error);
	    });
	};

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
};

var ViewModel = function(Model) {
	var self = this,
		model = new Model(self);

	this.users = ko.observableArray([]); 

	this.getUsers = function() {
		model.getUsers();
	};

	this.updateUsers = function(users) {
		self.users.splice(0, self.users().length);
		for (var i = 0; i < users.length; i++) {
			self.users.push(users[i]);
		}
		self.updatewinnerStand();
		self.hideAllInMain();
		$('.users').show();
	};

	this.winnerstand = ko.observableArray([]);

	this.updatewinnerStand = function() {
		var winnerstand = [	{name: 'none', score: 0}, {name: 'none', score: 0}, {name: 'none', score: 0}];
		for (var i = 0; i < self.users().length; i++) {
			if (self.users()[i].totalScore >= winnerstand[0].score) {
				winnerstand[2].name = winnerstand[1].name;
				winnerstand[2].score = winnerstand[1].score;
				winnerstand[1].name = winnerstand[0].name;
				winnerstand[1].score = winnerstand[0].score;
				winnerstand[0].name = self.users()[i].name;
				winnerstand[0].score = self.users()[i].totalScore;
			} else if (self.users()[i].totalScore >= winnerstand[1].score) {
				winnerstand[2].name = winnerstand[1].name;
				winnerstand[2].score = winnerstand[1].score;
				winnerstand[1].name = self.users()[i].name;
				winnerstand[1].score = self.users()[i].totalScore;
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

	this.hideAllInMain = function() {
		$('.toggle').hide();
	};

	this.newUser = function() {
		self.hideAllInMain();
		$('.newUser').show();
	};

	this.newUserName = ko.observable();
	this.newUserUsername = ko.observable();
	this.newUserPassword = ko.observable();
	this.newUserVerifyPassword = ko.observable();

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

	this.currentUser = ko.observableArray([]);
	this.currentDates = ko.observableArray([]);

	this.getUser = function() {
		model.getUser(self.currentUser()[0]._id);
	};

	this.generateUser = function(user) {
		self.currentUser.splice(0, self.currentUser().length);
		self.currentUser.push(user);
		self.updatePublicStatusDisplay(user.publicStatus);
		model.getUserDates(user);
		self.showUser();
	};

	this.showUser = function() {
		self.hideAllInMain();
		$('.user').show();
	};

	this.generateUserDates = function(dates) {
		self.currentDates.splice(0, self.currentDates().length);
		for (var i = 0; i < dates.length; i++) {
			self.currentDates.push(dates[i]);
		}
	};

	this.deleteUser = function() {
		model.deleteUser(self.currentUser()[0]._id);
	};

	this.currentUserDate = ko.observableArray([]);
	this.date = ko.observable('11/11/2011');

	this.editDate = function(user) {
		self.hideAllInMain();
		$('.userDate').show();
		self.currentUserDate.splice(0, self.currentUserDate().length);
		self.currentUserDate.push(user);
	};

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

	this.veiwAddNewUserDate = function() {
		self.hideAllInMain();
		$('.newUserDate').show();
	};

	this.addNewUserDate = function() {
		model.createDate(self.newUserDate());
	};

	this.deleteUserDate = function() {
		var date = self.currentUserDate()[0];

		model.deleteUserDate(date._author, date._id);
	};

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

	this.clickedSugar = function() {
		var currentDate = self.currentUserDate()[0];
		if (currentDate.sugar) {
			currentDate.sugar = false;
		} else {
			currentDate.sugar = true;
		}
		self.currentUserDate.splice(0, self.currentUser().length);
		self.currentUserDate.push(currentDate);
	};
	
	this.clickedSoda = function() {
		var currentDate = self.currentUserDate()[0];
		if (currentDate.soda) {
			currentDate.soda = false;
		} else {
			currentDate.soda = true;
		}
		self.currentUserDate.splice(0, self.currentUser().length);
		self.currentUserDate.push(currentDate);
	};

	this.userName = ko.observable('');
	this.userPassword = ko.observable('');

	this.validatelogin = function() {
		event.preventDefault();

		if (!self.userName()) {
			return alert('User Name Required');
		}

		if (!self.userPassword()) {
			return alert('Password Required');
		}

		model.validatelogin(self.userName(), self.userPassword());
	};

	this.login = function(user) {
		self.generateUser(user);
		$('.loggedIn').show();
		$('.loggedOut').hide();
	};

	this.logout = function() {
		model.user = {};
		self.currentUser([]);
		self.getUsers();
		self.showLogout();
	};

	this.showLogin = function() {
		$('.toggle').hide();
		$('.login').show();
	};

	this.showLogout = function() {
		$('.loggedIn').hide();
		$('.loggedOut').show();
	};

	this.publicStatusClicked = function(user) {
		model.updateUserPublicStatus(!user.publicStatus);
	};

	this.publicStatusDisplay = ko.observable('Public');

	this.updatePublicStatusDisplay = function(publicStatus) {
		if (publicStatus) {
			self.publicStatusDisplay('Public');
		} else {
			self.publicStatusDisplay('Private');
		}
	};

	model.getUsers(true);
};

ko.applyBindings(new ViewModel(Model));