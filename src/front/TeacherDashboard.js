var React = require('react');
var $ = require('jquery');
var $cookie = require('jquery.cookie');

var DatePicker = require('react-datepicker');

var moment = require('moment');

var say = require('./say');

var Header = require('./Header');




var TeacherDashboard = React.createClass({
	selectedClassId: null,
	selectedAssignId: null,

	render: function() {
			

		var selectClass = function(event) {
			this.selectedClassId = event.target.value;
			this.refreshAssignments();
		}.bind(this);

		var nameChanged = function(event) {
			this.upsertClass({
				_id: event.target.dataset.id,
				name: event.target.innerText
			});
		}.bind(this);

		var onNewClass = function(event) {
			this.upsertClass({
				name: 'New Class'
			});
		}.bind(this);

		var onDeleteClass = function(event) {
			$.ajax({
				url: '/teacher/deleteClass/' + event.target.dataset.id,
				type: 'POST'
			}).fail(function(err) {
				say.error(err);
			}).done(function(data) {
				this.refreshClasses();
			}.bind(this));
		}.bind(this);

		var selectAssignment = function(event) {
			this.selectedAssignId = event.target.value;
		}.bind(this);

		var titleChanged = function(event) {
			//console.log(event);
			//console.log(event.target);
			console.log(event.target.dataset.id, event.target.value, event.target.innerText)
			//if(event.charCode == 13 && !event.shiftKey) {
				this.updateAssignments({
					_id: event.target.dataset.id,
					title: event.target.innerText
				});
			//}
		}.bind(this);

		var descChanged = function(event) {
			//if(event.charCode == 13 && !event.shiftKey) {
				this.updateAssignments({
					_id: event.target.dataset.id,
					description: event.target.innerText
				});
			//}
		}.bind(this);

		var assignmentDueChanged = function(_id, date) {
			this.updateAssignments({
				_id: _id,
				due: date
			})
		}.bind(this);

		var assignmentActiveChanged = function(event) {
			this.updateAssignments({
				_id: event.target.dataset.id,
				active: event.target.checked
			});
		}.bind(this);

		var onNewAssignment = function(event) {
			this.updateAssignments({
				title: 'New Assignment',
				class: this.selectedClassId,
				due: moment().format()
			});
		}.bind(this);

		var onDeleteAssignment = function(event) {
			$.ajax({
				url: '/teacher/deleteAssignment/' + event.target.dataset.id,
				type: 'POST'
			}).fail(function(err) {
				say.error(err);
			}).done(function(data) {
				this.refreshAssignments();
			}.bind(this));
		}.bind(this);

		return (
			<div>
				<Header title='TeacherDashboard'/>
				<div>
				<div className='row'>
					<div className='col-md-1' />
					<div className='col-md-2'>
						<div className='form-group'>
							<h2>Class</h2>
							<table className='table table-hover table-striped table-condensed'>
								<thead>
									<tr>
										<th></th>
										<th></th>
										<th></th>
									</tr>
								</thead>
								<tbody> 
									{
										this.state.classes.map(function(cls) {
											return (
												<tr>
													<td><input type='radio' name='selectedClass' value={cls._id} onChange={selectClass}></input></td>
													<td data-id={cls._id} contentEditable={true} onBlur={nameChanged} >{cls.name}</td>
													<td><button data-id={cls._id} type='button' className='btn btn-danger btn-xs' onClick={onDeleteClass}>X</button></td>
												</tr>
											);
										})
									}
								</tbody>
							</table>
							<button type='button' className='btn btn-success' onClick={onNewClass}>+</button>
							
						</div>
					</div>


					<div className='col-md-8'>
						<div className='form-group'>
							<h2>Assignments</h2>
							<table className='table table-hover table-striped table-condensed'>
								<thead>
									<tr>
										<th>Title</th>
										<th>Description</th>
										<th>Due</th>
										<th>Active</th>
										<th></th>
									</tr>
								</thead>
								<tbody> 
									{
										this.state.assignments.map(function(assignment) {
											
											return (
												<tr>
													<td data-id={assignment._id} contentEditable={true} onBlur={titleChanged} >{assignment.title}</td>
													<td data-id={assignment._id} contentEditable={true} onBlur={descChanged} >{assignment.description}</td>
													<td><DateCell _id={assignment._id} date={assignment.due} onChange={assignmentDueChanged} /></td>	
													<td><input data-id={assignment._id} type='checkbox' defaultChecked={assignment.active} onChange={assignmentActiveChanged} /></td>
													<td><button data-id={assignment._id} type='button' className='btn btn-danger btn-xs' onClick={onDeleteAssignment}>X</button></td>
												</tr>
											);
											//<td><DatePicker selected={moment(assignment.due)} onChange={assignmentDueChanged} /></td>
										})
									}
								</tbody>
							</table>
							<button type='button' className='btn btn-success' onClick={onNewAssignment}>+</button>
						</div>
					</div>
				</div>
				</div>
			</div>
		);
	},

	getInitialState: function() {
		return {
			classes: [],
			assignments: []
		};
	},

	componentDidMount: function() {
		this.refreshClasses();
	},


	refreshClasses: function() {
		$.ajax({
			url: '/teacher/getClasses',
			type: 'GET'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.setState({classes: data});
		}.bind(this));
	},

	upsertClass: function(update) {
		$.ajax({
			url: '/teacher/upsertClass',
			type: 'POST',
			data: update
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshClasses();
		}.bind(this));
	},

	refreshAssignments: function() {
		if(this.selectedClassId) {
			$.ajax({
				url: '/teacher/getAssignments?classId=' + this.selectedClassId,
				type: 'GET'
			}).fail(function(err) {
				say.error(err);
			}).done(function(data) {
				this.setState({assignments: data});
			}.bind(this));
		}
	},

	updateAssignments: function(update) {
		$.ajax({
			url: '/teacher/upsertAssignment',
			type: 'POST',
			data: update
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshAssignments();
		}.bind(this));
	}


});


var DateCell = React.createClass({
	render: function() {
		return (
			<div>
				<DatePicker selected={moment(this.props.date)} onChange={this.datePickerChanged} />
			</div>
		);
	},

	datePickerChanged: function(date) {
		this.props.onChange(this.props._id, date.format());
	}

});




module.exports = TeacherDashboard;