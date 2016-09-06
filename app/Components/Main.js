// Include React 
var React = require('react');

// Components
var Profile = require('./Profile');
// var Game = require('./Game');
var Chat = require('./Chat');

var Main = React.createClass({
	getInitialState: function(){
		var socket = io.connect('http://localhost:4000/');
		return {
			socket: socket,
			user: false
		}
	},
	componentDidMount: function(){
		this.setUserSocket();
	},
	handleLogin: function(userObj){
		this.state.socket.emit('new user', userObj);
	},
	setUserSocket: function(){
		var that = this;
		this.state.socket.on('set user', function(user){
			that.setState({user});
		})
	},
	render: function(){
		return (
			<div className="container">
				<div className="row">
					<Profile user={this.state.user} login={this.handleLogin}/>
					<Chat />
				</div>
			</div>
			);
	}
});

module.exports = Main;