var express = require('express');

var model = require('./model');

var router = express.Router();

router.get('/', function(req, res) {
	
	res.render('main', {react: 'TeacherDashboard'});
});

router.get('/students', function(req, res) {
	
	res.render('main', {react: 'StudentManagement'});
});

router.get('/getClasses', function(req, res) {
	model.Class.find({instructor: req.cookies.user._id}).then(function(classes) {
		return res.json(classes);
	}, function(err) {
		return res.status(500).json(err);
	});
});

router.post('/upsertClass', function(req, res) {
	
	req.body.instructor = req.cookies.user._id;

	if(req.body._id) {
		model.Class.findByIdAndUpdate(req.body._id, req.body, {upsert: true}).then(function(data) {
			console.log('update', data);
			return res.json(data);
		}, function(err) {
			return res.status(500).json(err);
		});
	} else {
		model.Class.create(req.body).then(function(data) {
			console.log('create', data);
			return res.json(data);
		}, function(err) {
			return res.status(500).json(err);
		});
	}
});



router.post('/deleteClass/:_id', function(req, res) {
	model.Class.findByIdAndRemove(req.params._id).then(function(err, data) {
		console.log('removed', err, data);
		return res.send('OK');

	})
});

router.get('/getAssignments/', function(req, res) {
	model.Assignment.find({class: req.query.classId}).then(function(data) {
		// TODO conver dates to mm/dd/yyyy
		

		return res.json(data);
	}, function(err) {
		return res.status(500).json(err);
	});
});

router.post('/upsertAssignment/', function(req, res) {
	
	console.log('update Assignment', req.body);

	if(req.body._id) {
		model.Assignment.findByIdAndUpdate(req.body._id, req.body, {upsert: true}).then(function(data) {
			console.log('update', data);
			return res.json(data);
		}, function(err) {
			return res.status(500).json(err);
		});
	} else {
		model.Assignment.create(req.body).then(function(data) {
			console.log('create', data);
			return res.json(data);
		}, function(err) {
			return res.status(500).json(err);
		});
	}
});

router.post('/deleteAssignment/:_id', function(req, res) {
	model.Assignment.findByIdAndRemove(req.params._id).then(function(err, data) {
		console.log('removed', err, data);
		return res.send('OK');
	})
});

// students

router.get('/getStudents', function(req, res) {
	model.Class.find({instructor: req.cookies.user._id}).then(function(classes) {
		var classIds = classes.map(function(cls) {
			return cls._id;
		});

		model.User.find({role: 'student', enrolls: {$in: classIds}}).then(function(students) {
			return res.json(students);
		}, function(err) {
			return res.status(500).json(err);
		});

	}, function(err) {
		return res.status(500).json(err);
	});
});

router.post('/upsertStudent/', function(req, res) {

	if(req.body._id) {
		model.User.findByIdAndUpdate(req.body._id, req.body, {upsert: true}).then(function(data) {
			console.log('update', data);
			return res.json(data);
		}, function(err) {
			return res.status(500).json(err);
		});
	} else {
		req.body.role = 'student'
		model.User.create(req.body).then(function(data) {
			console.log('create', data);
			return res.json(data);
		}, function(err) {
			return res.status(500).json(err);
		});
	}

	
});

router.post('/deleteStudent/:_id', function(req, res) {
	model.User.findByIdAndRemove(req.params._id).then(function(err, data) {
		console.log('removed', err, data);
		return res.send('OK');
	})
});


module.exports = {
	router: router
};	