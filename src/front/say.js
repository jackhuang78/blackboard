var util = require('util');

var error = function(err) {
	alert(util.format('ERROR %d %s: %s', err.status, err.statusText, err.responseText));
};

var msg = function(m) {
	alert(m);
};



module.exports = {
	error: error,
	msg: msg
};