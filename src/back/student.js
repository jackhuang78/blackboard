var express = require('express');
var router = express.Router();
var moment = require('moment');

var model = require('./model');

router.use(function(req, res, next) {
	if(req.cookies.user.role != 'student')
		res.redirect('/user/login');
	else
		next();
});


router.get('/', function(req, res) {
	res.render('main', {react: 'StudentDashboard'});
});

router.get('/getClass', function(req, res) {
	model.User.findOne({_id: req.cookies.user._id}).then(function(user) {
		model.Class.findOne({_id: user.enrolls}).then(function(cls) {
			model.Assignment.find({class: cls._id}).then(function(assignments) {
				
				//console.log('class', cls, 'assign', assignments);
				
				assignments = assignments.map(function(assignment) {
					return {
						_id: assignment._id,
						title: assignment.title,
						description: assignment.description,
						class: assignment.class,
						due: assignment.active 
							? moment(assignment.due).fromNow() + ' (' + moment(assignment.due).format('MM/DD/YYYY') + ')'
							: 'inactive',
						status: assignment.active 
							? (moment(assignment.due).isBefore(moment()) ? 'danger' : 'warning') 
							: 'info'
					};
				});



				return res.json({
					cls: cls,
					assignments: assignments
				});


			
			}, function(err) {
				return res.status(500).json(err); 
			});
		}, function(err) {
			return res.status(500).json(err);
		});
	}, function(err) {
		return res.status(500).json(err);
	});
});

module.exports = {
	router: router
};