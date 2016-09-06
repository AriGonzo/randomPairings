// Include React 
var React = require('react');

var Square = React.createClass({
	getInitialState: function(){
		return {
			marker: ""
		}
	},
	clickSquare: function(a){
		this.setState({
			marker: this.props.user.marker
		})
	},
	render: function(){
		return(
				<div className="col-sm-4 space open text-center" onClick={this.clickSquare.bind(null, this.props.value)}>
					<div className="gameMarker">{this.state.marker}</div>
				</div>
			)
	}
});

module.exports = Square;