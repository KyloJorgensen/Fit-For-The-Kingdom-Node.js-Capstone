var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server/server.js');

var should = chai.should();
var app = server.app;
chai.use(chaiHttp);

var user = {
    username: 'frank',
    password: 'gogo'
};
var name = 'Frank';
var frank = {};
var frankDate = {};

describe('Fit For The Kingdom', function() {
    it('should sendFile on GET', function(done) {
        chai.request(app)
        .get('/')
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.sendFile;
            done();
        });
    });



    it('should create user on post', function(done) {
        chai.request(app)
        .post('/user')
        .send({ 
            username: user.username,
            password: user.password,
            name: name           
        }).end(function(err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('username');
            res.body.should.have.property('password');
            res.body.should.have.property('name');
            res.body.username.should.equal(user.username);
            res.body.password.should.not.equal(user.password);
            res.body.name.should.equal(name);
            frank = res.body;
            done();
        });
    });
    
    it('should list of users on GET', function(done) {
        chai.request(app)
        .get('/user')
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            // console.log(res.body);
            done();
        });
    });
});

describe('After User is Created', function() {
    it('should object of a user on GET', function(done) {
        chai.request(app)
        .get('/user/' + frank._id)
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id');
            res.body._id.should.equal(frank._id);
            res.body.should.have.property('username');
            res.body.username.should.equal(frank.username);
            res.body.should.have.property('password');
            res.body.password.should.equal(frank.password);
            res.body.should.have.property('name');
            res.body.name.should.equal(frank.name);
            res.body.should.have.property('publicStatus');
            res.body.publicStatus.should.equal(frank.publicStatus);
            res.body.should.have.property('totalScore');
            res.body.totalScore.should.equal(frank.totalScore);
            done();
        });
    });

    it('should change public status on PUT', function(done) {
        chai.request(app)
        .put('/user/publicStatus')
        .send({
            user: user,
            publicStatus: !(frank.publicStatus)
        }).end(function(err, res) {
            res.should.have.status(202);
            res.should.be.json;
            res.body.should.have.property('_id');
            res.body._id.should.equal(frank._id);
            res.body.should.have.property('username');
            res.body.username.should.equal(frank.username);
            res.body.should.have.property('password');
            res.body.password.should.equal(frank.password);
            res.body.should.have.property('name');
            res.body.name.should.equal(frank.name);
            res.body.should.have.property('publicStatus');
            res.body.publicStatus.should.equal(!frank.publicStatus);
            res.body.should.have.property('totalScore');
            res.body.totalScore.should.equal(frank.totalScore);
            frank = res.body;
            done();
        });
    });

    it('should create date on POST', function(done) {
        chai.request(app)
        .post('/date')
        .send({
            user: user,
            date: "2016-09-01"
        }).end(function(err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('_author');
            res.body.should.have.property('date');
            res.body.date.should.equal("2016-09-01");
            res.body.should.have.property('exercise');
            res.body.should.have.property('sugar');
            res.body.should.have.property('soda');
            res.body.should.have.property('healthyChoice');
            res.body.should.have.property('satisfied');
            res.body.should.have.property('score');
            res.body.should.have.property('_id');
            frankDate = res.body;
            done(); 
        });
    });

    it('should create another date on POST', function(done) {
        chai.request(app)
        .post('/date')
        .send({
            user: user,
            date: "2016-09-02"
        }).end(function(err, res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.have.property('_author');
            res.body.should.have.property('date');
            res.body.date.should.equal("2016-09-02");
            res.body.should.have.property('exercise');
            res.body.should.have.property('sugar');
            res.body.should.have.property('soda');
            res.body.should.have.property('healthyChoice');
            res.body.should.have.property('satisfied');
            res.body.should.have.property('score');
            res.body.should.have.property('_id');
            done(); 
        });
    });
});

describe('After Date is Created', function() {
    it('should object of a date on GET', function(done) {
        chai.request(app)
        .get('/date/date/' + frankDate._id)
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_author');
            res.body._author.should.equal(frankDate._author);
            res.body.should.have.property('date');
            res.body.date.should.equal(frankDate.date);
            res.body.should.have.property('exercise');
            res.body.exercise.should.equal(frankDate.exercise);
            res.body.should.have.property('sugar');
            res.body.sugar.should.equal(frankDate.sugar);
            res.body.should.have.property('soda');
            res.body.soda.should.equal(frankDate.soda);
            res.body.should.have.property('healthyChoice');
            res.body.healthyChoice.should.equal(frankDate.healthyChoice);
            res.body.should.have.property('satisfied');
            res.body.satisfied.should.equal(frankDate.satisfied);
            res.body.should.have.property('score');
            res.body.score.should.equal(frankDate.score);
            res.body.should.have.property('_id');
            res.body._id.should.equal(frankDate._id);
            done(); 
        });
    });

    it('should update date on PUT', function(done) {
        chai.request(app)
        .put('/date')
        .send({
            user: user,
            date: {
                _id: frankDate._id,
                exercise: 1,
                healthyChoice: 1,
                satisfied: 1,
                sugar: !(frankDate.sugar),
                soda: !(frankDate.soda)
            }
        }).end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            done(); 
        });
    });

    it('should array of users dates on GET', function(done) {
        chai.request(app)
        .get('/date/users/' + frank._id)
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(2);
            res.body[0].should.have.property('_author');
            res.body[0].should.have.property('date');
            res.body[0].should.have.property('exercise');
            res.body[0].should.have.property('sugar');
            res.body[0].should.have.property('soda');
            res.body[0].should.have.property('healthyChoice');
            res.body[0].should.have.property('satisfied');
            res.body[0].should.have.property('score');
            res.body[0].should.have.property('_id');
            res.body[1].should.have.property('_author');
            res.body[1].should.have.property('date');
            res.body[1].should.have.property('exercise');
            res.body[1].should.have.property('sugar');
            res.body[1].should.have.property('soda');
            res.body[1].should.have.property('healthyChoice');
            res.body[1].should.have.property('satisfied');
            res.body[1].should.have.property('score');
            res.body[1].should.have.property('_id');

            done(); 
        });
    });
});

describe('check date update', function() {
    it('should updated on GET', function(done) {
        chai.request(app)
        .get('/date/date/' + frankDate._id)
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_author');
            res.body._author.should.equal(frankDate._author);
            res.body.should.have.property('date');
            res.body.date.should.equal(frankDate.date);
            res.body.should.have.property('exercise');
            res.body.exercise.should.equal(1);
            res.body.should.have.property('sugar');
            res.body.sugar.should.equal(!frankDate.sugar);
            res.body.should.have.property('soda');
            res.body.soda.should.equal(!frankDate.soda);
            res.body.should.have.property('healthyChoice');
            res.body.healthyChoice.should.equal(1);
            res.body.should.have.property('satisfied');
            res.body.satisfied.should.equal(1);
            res.body.should.have.property('score');
            res.body.score.should.equal(8);
            res.body.should.have.property('_id');
            res.body._id.should.equal(frankDate._id);
            done(); 
        });
    });
});

describe('Delete date', function() {
    it('should object of a user on DELETE', function(done) {
        chai.request(app)
        .delete('/date')
        .send({
            user: user,
            dateId: frankDate._id
        }).end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id');
            res.body._id.should.equal(frank._id);
            res.body.should.have.property('username');
            res.body.username.should.equal(frank.username);
            res.body.should.have.property('password');
            res.body.password.should.equal(frank.password);
            res.body.should.have.property('name');
            res.body.name.should.equal(frank.name);
            res.body.should.have.property('publicStatus');
            res.body.publicStatus.should.equal(frank.publicStatus);
            res.body.should.have.property('totalScore');
            res.body.totalScore.should.equal(frank.totalScore);
            done(); 
        });
    });
});

describe('check date', function() {
    it('should be status 400 on GET', function(done) {
        chai.request(app)
        .get('/date/date/' + frankDate._id)
        .end(function(err, res) {
            res.should.have.status(400);
            done(); 
        });
    });
});

describe('Delete date', function() {
    it('should object of a user on DELETE', function(done) {
        chai.request(app)
        .delete('/user/' + frank._id + '/sdfghuytrfgvhjiuqyghjuhgfde456789765r4fghbvfrt54rfgbnjkio98765rtghgft')
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('message');
            res.body.message.should.equal('delete ' + frank.username);
            done(); 
        });
    });
});

describe('check user', function() {
    it('should be status 400 on GET', function(done) {
        chai.request(app)
        .get('/user/' + frank._id)
        .end(function(err, res) {
            res.should.have.status(400);
            done(); 
        });
    });
});