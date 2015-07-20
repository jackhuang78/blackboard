var React = require('react');
var $ = require('jquery');
var $cookie = require('jquery.cookie');
var moment = require('moment');
var say = require('./say');
var Header = require('./Header');

var StudentDashboard = React.createClass({
	render: function() {
		console.log(this.state);
		return (
			<div className='row'>
				<div className='col-md-1' />
				<div className='col-md-10'>
					<Header title='Student Dashboard' />
					<div>
						<h2>Assignments for {this.state.cls.name}</h2>
						<div className='form-group'>
							<table className='table table-hover table-striped table-condensed'>
								<thead>
									<tr>
										<th>Title</th>
										<th>Description</th>
										<th>Due</th>
									</tr>
								</thead>
								<tbody> 
									{
										this.state.assignments.map(function(assignment) {
											var status = assignment.status;
											return (
												<tr>
													<td>{assignment.title}</td>
													<td>{assignment.description}</td>
													<td className={status}>{assignment.due}</td>
												</tr>
											);
											
										}.bind(this))
									}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		);
	},

	getInitialState: function() {
		return {
			cls: {
				name: 'class'
			},
			assignments: []
		};
	},

	componentDidMount: function() {
		this.refresh();
	},

	refresh: function() {
		$.ajax({
			url: '/student/getClass',
			type: 'GET'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.setState({
				cls: data.cls,
				assignments: data.assignments
			});
		}.bind(this));
	},
});

module.exports = StudentDashboard;