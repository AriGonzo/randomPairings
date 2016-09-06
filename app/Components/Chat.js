// Include React 
var React = require('react');

var Chat = React.createClass({
	render: function(){
		return (
			<div>
				<div id="joinBtnContainer">
					<a href="javascript:void(0)" id="joinBtn" className={this.props.user ? "btn btn-success center-block" : "btn btn-success center-block disabled"}>Join a Room</a>
				</div>
				<div className="hidden" id="messagesContainer">
					<div id="showMessagesContainer">
						<ul id="messagesList">
							
						</ul>
					</div>
					<div className="row">
						<div className="col-md-9">
							<input className="form-control" id="message" type="text" placeholder="Message" />
						</div>
						<div className="col-md-3">
							<a href="javascript:void(0)" id="submitMessage" className="btn btn-primary">Submit</a>
						</div>
					</div>
				</div>
			</div>
			)
	}
});

module.exports = Chat;
