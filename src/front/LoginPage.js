var React = require('react');
var $ = require('jquery');
var say = require('./say');

var LoginPage = React.createClass({
	render: function() {
		return (
			<div>
				<h1>Login Page</h1>
				<div className='row'>
					<div className='col-md-2'></div>
					<div className='col-md-6'>
						<LoginBox />
					</div>
				</div>
			</div>
		);
	}
});

var LoginBox = React.createClass({
	render: function() {
		return (
			<div>
				<form>
					<div className='form-group'>
						<label>Username</label>
						<input ref='username' type='email' className='form-control' id='usernameInput' placeholder='Your username' />
					</div>
					<div className='form-group'>
						<label>Password</label>
						<input ref='password' type='password' className='form-control' id='passwordInput' placeholder='Your Password' />
					</div>
					<button ref='submit' type='button' className='btn btn-default' onClick={this.loginClicked}>Login</button>
				</form>
			</div>
		);
	},

	loginClicked: function(event) {
		var cred = {
			username: React.findDOMNode(this.refs.username).value,
			password: React.findDOMNode(this.refs.password).value
		};

		//console.log(cred);
		//React.findDOMNode(this.refs.submit).submit();

		$.ajax({
			url: 'login',
			type: 'POST',
			data: cred
		}).fail(function(err) {
			say.error(err);
		}).done(function(data) {
			//console.log('redirect to', data.redirect);
			
			window.location.href = data.redirect;
		});
	}


});

module.exports = LoginPage;