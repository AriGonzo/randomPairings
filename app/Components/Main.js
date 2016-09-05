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
			socket: socket
		}
	},
	render: function(){
		return (
			<div className="container">
				<div className="row">
					<Profile socket={this.state.socket}/>
					<Chat />
				</div>
			</div>
			);
	}
});

module.exports = Main;