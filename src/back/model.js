// load libraries
var mongoose = require('mongoose');


// connect to MongoDB
mongoose.connect('mongodb://localhost/blackboard');

var Schema = mongoose.Schema;
var userSchema = new Schema({
	name: String,
	username: String,
	password: String,	// TODO store the salted pw instead
	role: String,
	session: String,
	teaches: [{type: Schema.Types.ObjectId, ref: 'class'}],
	enrolls: {type: Schema.Types.ObjectId, ref: 'class'}
});

var classSchema = new Schema({
	name: String,
	instructor: {type: Schema.Types.ObjectId, ref: 'user'},
	assignments: [{type: Schema.Types.ObjectId, ref: 'assignment'}],
	students: [{type: Schema.Types.ObjectId, res: 'user'}]
});

var assignmentSchema = new Schema({
	title: String,
	description: String,
	due: Date,
	active: Boolean,
	class: {type: Schema.Types.ObjectId, ref: 'class'}
});

var User = mongoose.model('user', userSchema);
var Class = mongoose.model('class', classSchema);
var Assignment = mongoose.model('assignment', assignmentSchema);


function id(hex) {
	return mongoose.Types.ObjectId(hex);
}


module.exports = {
	User: User,
	Class: Class,
	Assignment: Assignment,
	id: id
};



