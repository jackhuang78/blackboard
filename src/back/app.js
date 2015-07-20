// load libraries
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// load modules
var user = require('./user');
var teacher = require('./teacher');
var student = require('./student');
var module = require('./model');

// create server
var app = express();

// set accessible path from the frontend
app.use('/modules', express.static('node_modules'));
app.use('/build', express.static('build'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set view enginer and view directory
app.set('view engine', 'ejs');
app.set('views', 'src/front');


app.use(function(req, res, next) {	
	console.log(req.method, req.url, req.cookies);
	if(req.path === '/user/login')
		return next();

	user.getUser(req.cookies.session).then(function(user) {
		//console.log('user', user);
		if(!user) 
			return res.redirect('/user/login');

		req.cookies.user = user;
		return next();	
	}, function(err) {
		res.status(500).json(err);
	});
});

//main page
app.get('/', function(req, res) {
	res.redirect('/user/login');
});



app.use('/user', user.router);
app.use('/teacher', teacher.router);
app.use('/student', student.router);

// run server
var port = process.env.PORT | 5000; 
app.listen(port, function(err) {
	if(err) {
		console.log('Failed to run server at port ' + port);
	} else {
		console.log('Server running on port ' + port);
	}
});