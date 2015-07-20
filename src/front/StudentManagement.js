var React = require('react');
var $ = require('jquery');
var $cookie = require('jquery.cookie');
var moment = require('moment');
var say = require('./say');
var Header = require('./Header');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

var StudentManagement = React.createClass({
	render: function() {
		return (
			<div className='row'>
				<div className='col-md-1' />
				<div className='col-md-10' >
					<Header title='Teacher Dashboard' />
					<ul className="nav nav-pills">
					  <li role="presentation"><a href="/teacher">Classes and Assignments</a></li>
					  <li role="presentation" className="active"><a href="/teacher/students">Student Management</a></li>
					</ul>

					<Modal show={this.state.showWarning} onHide={this.onCloseWarning}>
	          <Modal.Header closeButton>
	            <Modal.Title>Modal heading</Modal.Title>
	          </Modal.Header>
	          <Modal.Body>
	            <p>Are you sure to delete this student?</p>
	          </Modal.Body>
	          <Modal.Footer>
	          	<Button bsStyle='danger' onClick={this.onDeleteStudentConfirmed}>Confirm</Button>
	            <Button onClick={this.onCloseWarning}>Cancel</Button>
	          </Modal.Footer>
	        </Modal>

					<div className='form-group'>
						<table className='table table-hover table-striped table-condensed'>
							<thead>
								<tr>
									<th>Name</th>
									<th>Username</th>
									<th>Password</th>
									<th>Enrolls In</th>
									<th></th>
								</tr>
							</thead>
							<tbody> 
								{
									this.state.students.map(function(student) {
										return (
											<tr>
												<td data-id={student._id} contentEditable={true} onBlur={this.onEditName} >{student.name}</td>
												<td data-id={student._id} contentEditable={true} onBlur={this.onEditUsername} >{student.username}</td>
												<td key={Date.now()} data-id={student._id} contentEditable={true} onBlur={this.onEditPassword} >********</td>
												<td><select data-id={student._id} class='form-control' onChange={this.onChangeClass} value={student.enrolls}> 
												{
													this.state.classes.map(function(cls) {
														// if(student.enrolls === cls._id)
														// 	return (<option selected>{cls.name}</option>);	
														// else
															return (<option value={cls._id}>{cls.name}</option>);
													}.bind(this))
												}
												</select></td>
												<td><button data-id={student._id} type='button' className='btn btn-danger btn-xs' onClick={this.onDeleteStudent}>X</button></td>
											</tr>
										);
										
									}.bind(this))
								}
							</tbody>
						</table>
						<button type='button' className='btn btn-success' onClick={this.onAddStudent}>+</button>
					</div>
				</div>
			</div>
		);
	},

	getInitialState: function() {
		return {
			students: [],
			showWarning: false
		};
	},

	componentDidMount: function() {
		this.refreshStudents();
		this.refreshClasses();
	},

	refreshClasses: function() {
		console.log('refreshClasses');
		$.ajax({
			url: '/teacher/getClasses',
			type: 'GET'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.setState({classes: data});
		}.bind(this));
	},

	refreshStudents: function() {
		console.log('refreshStudents');
		$.ajax({
			url: '/teacher/getStudents',
			type: 'GET'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.setState({students: data});
		}.bind(this));
	},

	onAddStudent: function(event) {
		console.log('add student');
		$.ajax({
			url: '/teacher/upsertStudent',
			type: 'POST',
			data: {
				name: 'New Student',
				enrolls: this.state.classes[0]._id
			}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
	},

	onDeleteStudent: function(event) {
		console.log('delete student');
		this.setState({showWarning: true, deleteId: event.target.dataset.id});
	},

	onDeleteStudentConfirmed: function() {
		$.ajax({
			url: '/teacher/deleteStudent/' + this.state.deleteId,
			type: 'POST'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
		this.onCloseWarning();
	},

	onCloseWarning: function() {
		this.setState({showWarning: false});
	},

	onEditName: function(event) {
		console.log('edit name');
		$.ajax({
			url: '/teacher/upsertStudent',
			type: 'POST',
			data: {
				_id: event.target.dataset.id,
				name: event.target.innerText
			}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
	},

	onEditUsername: function(event) {
		console.log('edit name');
		$.ajax({
			url: '/teacher/upsertStudent',
			type: 'POST',
			data: {
				_id: event.target.dataset.id,
				username: event.target.innerText
			}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
	},

	onEditPassword: function(event) {
		console.log('edit name');
		$.ajax({
			url: '/teacher/upsertStudent',
			type: 'POST',
			data: {
				_id: event.target.dataset.id,
				password: event.target.innerText
			}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
	},

	onChangeClass: function(event) {
		console.log('change class');
		// console.log(event);
		// console.log(event.target.value);
		$.ajax({
			url: '/teacher/upsertStudent',
			type: 'POST',
			data: {
				_id: event.target.dataset.id,
				enrolls: event.target.value
			}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
	}

});


module.exports = StudentManagement;