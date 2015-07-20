var React = require('react');
var $ = require('jquery');
var $cookie = require('jquery.cookie');
var say = require('./say');

var Header = React.createClass({
	render: function() {
		return (
			<div>
				<div className='row'>
					<div className='col-md-10'>
						<h1>{this.props.title}</h1>
					</div>
					<div className='col-md-2'>
						<span>
							<h5 vertical-align='bottom'>{'Welcome back, ' + $.cookie('name')}</h5>
							<button ref='logout' type='button' className='btn btn-default' onClick={this.logoutClicked}>Logout</button>
						</span>
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

module.exports = Header;