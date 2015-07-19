var React = require('react');
var $ = require('jquery');
var $cookie = require('jquery.cookie');

var DatePicker = require('react-datepicker');

var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var TableDataSet = ReactBsTable.TableDataSet;
var dateFormat = require('dateformat');

var say = require('./say');




var TeacherDashboard = React.createClass({

	classTableData: new TableDataSet([]),
	selectedClassRow: null,

	assignmentTableData: new TableDataSet([]),
	selectedAssignmentRow: null,

	studentTableData: new TableDataSet([]),
	selectedStudentRow: null,

	render: function() {

		var selectRowProp = {
			mode: "radio",
			clickToSelect: true,
			bgColor: "rgb(238, 193, 213)",
			onSelect: this.onRowSelect
		};

		var cellEditProp = {
			mode: "click",
			blurToSave: true,
			afterSaveCell: this.onRowEdited
		};

		var selectAssignmentRowProp = {
			mode: "radio",
			clickToSelect: true,
			bgColor: "rgb(238, 193, 213)",
			onSelect: this.onAssignmentRowSelect
		};

		var assignmentCellEditProp = {
			mode: "click",
			blurToSave: true,
			afterSaveCell: this.onAssignmentCellEdited
		};

		function dateFormatter(cell, row) {
			console.log(cell, typeof(cell));
			return (<DatePicker></DatePicker>);

			//return '<input>abc</input>'//dateFormat(cell, 'yyyy/mm/dd');
		}

		function activeFormatter(cell, row) {
			return cell ? 'Active' : 'Inactive';
		}

		var selectStudentRowProp = {
			mode: "radio",
			clickToSelect: true,
			bgColor: "rgb(238, 193, 213)",
			onSelect: this.onStudentRowSelect
		};

		var studentCellEditProp = {
			mode: "click",
			blurToSave: true,
			afterSaveCell: this.onStudentCellEdited
		};


		return (
			<div>
				<Header title='TeacherDashboard' />
				<div className='row'>
					<div className='col-md-3'>
						<h2>Classes</h2>				
						<div className='form-group'>
							<button type='button' className='btn btn-success' onClick={this.onCreateClick}>Create</button>
							<button type='button' className='btn btn-danger' onClick={this.onDeleteClick}>Delete</button>
						</div>
						<BootstrapTable data={this.classTableData} striped={true} hover={true} condensed={true} clickToSelect={true} selectRow={selectRowProp} cellEdit={cellEditProp}>
							<TableHeaderColumn hidden={true} isKey={true} dataField="_id">Product ID</TableHeaderColumn>
							<TableHeaderColumn dataField="name">Name</TableHeaderColumn>
		  			</BootstrapTable>
		  		</div>
					<div className='col-md-6'>
						<div className='row'>
			  			<h2>Assignments</h2>				
			  			<div className='form-group'>
								<button type='button' className='btn btn-success' onClick={this.onCreateAssignmentClick}>Create</button>
								<button type='button' className='btn btn-danger' onClick={this.onDeleteAssignmentClick}>Delete</button>
							</div>
			  			<BootstrapTable data={this.assignmentTableData} height={120} striped={true} hover={true} condensed={true} clickToSelect={true} selectRow={selectAssignmentRowProp} cellEdit={assignmentCellEditProp}>
								<TableHeaderColumn hidden={true} isKey={true} dataField="_id">ID</TableHeaderColumn>
								<TableHeaderColumn dataField="title">Title</TableHeaderColumn>
								<TableHeaderColumn dataField="description">Description</TableHeaderColumn>
								<TableHeaderColumn dataField="due" dataFormat={dateFormatter}>Due</TableHeaderColumn>
								<TableHeaderColumn dataField="active" dataFormat={activeFormatter} editable={false}>Active</TableHeaderColumn>
			  			</BootstrapTable>
		  			</div>
		  			<div className='row'>
			  			<h2>Students</h2>				
			  			<div className='form-group'>
								<button type='button' className='btn btn-success' onClick={this.onCreateStudentClick}>Create</button>
								<button type='button' className='btn btn-danger' onClick={this.onDeleteStudentClick}>Delete</button>
							</div>
			  			<BootstrapTable data={this.studentTableData} striped={true} hover={true} condensed={true} clickToSelect={true} selectRow={selectStudentRowProp} cellEdit={studentCellEditProp}>
								<TableHeaderColumn hidden={true} isKey={true} dataField="_id">ID</TableHeaderColumn>
								<TableHeaderColumn dataField="name">Name</TableHeaderColumn>
								<TableHeaderColumn dataField="username">Username</TableHeaderColumn>
			  			</BootstrapTable>
		  			</div>
		  		</div>
		  	</div>
			</div>
		);
	},

	getInitialState: function() {
		return {
			classes: []
		};
	},

	componentDidMount: function() {
		console.log('component mounted');
		this.refreshClasses();
	},

	refreshClasses: function() {
		$.ajax({
			url: '/teacher/getClasses',
			type: 'GET'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.classTableData.setData(data);
		}.bind(this))
	},

	onRowSelect: function(row, isSelected) {
		this.selectedClassRow = isSelected ? row : null;
		if(isSelected) {
			this.refreshAssignments();
			this.refreshStudents();
		}
		console.log(row, isSelected);
	},

	onRowEdited: function(row, cellName, cellValue) {
		console.log(row, cellName, cellValue);
		$.ajax({
			url: '/teacher/upsertClass',
			type: 'POST',
			data: row
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshClasses();
		}.bind(this));
	},

	onCreateClick: function(event) {
		console.log('Create row');
		$.ajax({
			url: '/teacher/upsertClass',
			type: 'POST',
			data: {name: 'New Class'}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshClasses();
		}.bind(this));
	},

	onDeleteClick: function(event) {
		console.log('Delete row', this.selectedClassRow);
		if(this.selectedClassRow) {
			$.ajax({
				url: '/teacher/deleteClass/' + this.selectedClassRow._id,
				type: 'POST'
			}).fail(function(err) {
				say.error(err);
			}).done(function(data) {
				this.refreshClasses();
			}.bind(this));	
		}
	},


	refreshAssignments: function() {
		console.log('refresh assignments');
		$.ajax({
			url: '/teacher/getAssignments/' + this.selectedClassRow._id,
			type: 'GET'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			console.log('assignments', data);
			this.assignmentTableData.setData(data);
		}.bind(this));
	},

	onAssignmentRowSelect: function(row, isSelected) {
		this.selectedAssignmentRow = isSelected ? row : null;

		console.log(row, isSelected);
	},

	onAssignmentCellEdited: function(row, cellName, cellValue) {
		console.log(row, cellName, cellValue);
		$.ajax({
			url: '/teacher/upsertAssignment/',
			type: 'POST',
			data: row
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshAssignments();
		}.bind(this));
	},

	onCreateAssignmentClick: function(event) {
		console.log('Create assignment');
		$.ajax({
			url: '/teacher/upsertAssignment/',
			type: 'POST',
			data: {title: 'New Assignment', description: '', active: false, due: '9999/12/31', class: this.selectedClassRow._id}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshAssignments();
		}.bind(this));
	},

	onDeleteAssignmentClick: function(event) {
		console.log('Delete row', this.selectedAssignmentRow);
		if(this.selectedAssignmentRow) {
			$.ajax({
				url: '/teacher/deleteAssignment/' + this.selectedAssignmentRow._id,
				type: 'POST'
			}).fail(function(err) {
				say.error(err);
			}).done(function(data) {
				this.refreshClasses();
			}.bind(this));	
		}
	},

	// students

	refreshStudents: function() {
		console.log('refresh Students');
		$.ajax({
			url: '/teacher/getStudents/' + this.selectedClassRow._id,
			type: 'GET'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			console.log('Students', data);
			this.studentTableData.setData(data);
		}.bind(this));
	},

	onStudentRowSelect: function(row, isSelected) {
		this.selectedStudentRow = isSelected ? row : null;

		console.log(row, isSelected);
	},

	onStudentCellEdited: function(row, cellName, cellValue) {
		console.log(row, cellName, cellValue);
		$.ajax({
			url: '/teacher/upsertStudent/',
			type: 'POST',
			data: row
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
	},

	onCreateStudentClick: function(event) {
		console.log('Create Student');
		$.ajax({
			url: '/teacher/upsertStudent/',
			type: 'POST',
			data: {name: 'New Student', username: '', enrolls: this.selectedClassRow._id}
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			this.refreshStudents();
		}.bind(this));
	},

	onDeleteStudentClick: function(event) {
		console.log('Delete row', this.selectedStudentRow);
		if(this.selectedStudentRow) {
			$.ajax({
				url: '/teacher/deleteStudent/' + this.selectedStudentRow._id,
				type: 'POST'
			}).fail(function(err) {
				say.error(err);
			}).done(function(data) {
				this.refreshClasses();
			}.bind(this));	
		}
	},


});





var Header = React.createClass({
	render: function() {
		return (
			<div>
				<div className='row'>
					<div className='col-md-8'>
						<h1>{this.props.title}</h1>
					</div>
					<div className='col-md-2'>
						{'Hi, ' + $.cookie('name')}
					</div>
					<div className='col-md-2'>
						<button ref='logout' type='button' className='btn btn-default' onClick={this.logoutClicked}>Logout</button>
					</div>
				</div>
			</div>
		);
	},

	logoutClicked: function(event) {
		$.ajax({
			url: '/user/logout',
			type: 'POST'
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			window.location.href = data.redirect;
		});
	}
});

module.exports = TeacherDashboard;