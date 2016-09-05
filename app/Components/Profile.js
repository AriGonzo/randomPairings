// Include React 
var React = require('react');

var Profile = React.createClass({
	getInitialState: function(){
		this.setUserSocket();
		return {
			user: false
		}
	},
	handleClick: function(){
		var userName = document.getElementById('userName').value;
		var image = document.getElementById('imageLink').value;

		this.props.socket.emit('new user', {
			name: userName,
			image: image
		});
	},
	setUserSocket: function(){
		var that = this;
		this.props.socket.on('set user', function(user){
			console.log(user)
			that.setState({
				user: user
			});
		})
	},
	render: function(){
		return (
			<div className="col-md-4">
				{this.state.user ? 
					<div className="row" id="userProfile">
						<div className="col-md-6">
							<h1 id="setUserName">
								{this.state.user.name}
							</h1>
						</div>
						<div className="col-md-6">
							<img id="setUserImg" width="170px" href={this.state.user.image} />
						</div>
					</div>
					:
					<div id="userInputContainer">
						<input className="form-control" id="userName" type="text" placeholder="Your Name" />
						<input className="form-control" id="imageLink" type="text" placeholder="Image URL" />
						<a href="javascript:void(0)" onClick={this.handleClick} className="btn btn-primary">Submit</a>
					</div>
				}
			</div>
			)
	}
});

module.exports = Profile;
