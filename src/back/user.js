// load libraries
var express = require('express');
var uuid = require('uuid');

var model = require('./model');


var User = model.User;


function getUser(session) {
	return new Promise(function(resolve, reject) {
		User.findOne({session: session}).then(function(user) {
			resolve(user);
		})
	});
}


// create Express Router
var router = express.Router();

router.get('/login', function(req, res) {
	//console.log(req.cookies);

	getUser(req.cookies.session).then(function(user) {

	//User.findOne({session: req.cookies.session}).then(function(user) {
		if(user) {
			res.cookie('name', user.name);

			if(user.role === 'teacher')
				return res.redirect('/teacher');
			else if(user.role === 'student')
				return res.redirect('/student');
			else
				return res.status(401).send('How come you don\'t have a role?');
		}
		return res.render('main', {react: 'LoginPage'});
	}).catch(function(err) {
		return res.status(500).json(err);
	});
});

router.post('/login', function(req, res) {

	User.findOne({username: req.body.username}).then(function(user) {
		if(!user || user.password !== req.body.password)
			return res.status(401).send('Invalid username/password combination.');

		
		var session = uuid.v4();
		user.session = session;
		user.save().then(function() {
			res.cookie('session', session);
			res.cookie('name', user.name);

			if(user.role === 'teacher')
				return res.json({redirect: '/teacher'});
			else if(user.role === 'student')
				return res.json({redirect: '/student'});
			else
				return res.status(401).send('How come you don\'t have a role?');

		});

	}).catch(function(err) {
		return res.status(500).json(err);
	});

	
});

router.post('/logout', function(req, res) {
	User.findOne({session: req.cookies.session}).then(function(user) {
		if(user) {
			user.session = undefined;
			user.save().then(function() {
				return res.json({redirect: '/'});
			});
		}
		return res.json({redirect: '/'});

	}).catch(function(err) {
		return res.status(500).json(err);
	});
});


module.exports = {
	router: router,
	getUser: getUser
};