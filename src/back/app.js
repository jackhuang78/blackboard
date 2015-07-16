var express = require('express');

var app = express();

app.use(express.static('node_modules'));
app.use(express.static('build'));
app.set('views', 'src/front');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('main', {react: 'login'});
});

app.listen(5000);