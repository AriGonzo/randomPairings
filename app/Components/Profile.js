// Include React 
var React = require('react');

var Profile = React.createClass({
	render: function(){
		return (
			<div className="col-md-4">
				{this.props.user ? 
					<div className="row" id="userProfile">
						<div className="col-md-6">
							<h1>
								{this.props.user.name}
							</h1>
						</div>
						<div className="col-md-6">
							<img width="170px" src={this.props.user.image} />
						</div>
					</div>
					:
					<div id="userInputContainer">
						<input className="form-control" id="userName" type="text" placeholder="Your Name" />
						<input className="form-control" id="imageLink" type="text" placeholder="Image URL" />
						<a href="javascript:void(0)" onClick={() => this.props.login({name:document.getElementById('userName').value, image:document.getElementById('imageLink').value})} className="btn btn-primary">Submit</a>
					</div>
				}
			</div>
			)
	}
});

module.exports = Profile;
