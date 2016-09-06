// Include React 
var React = require('react');

var Square = React.createClass({
	getInitialState: function(){
		return {
			marker: "",
			classNames: "col-sm-4 space openSquare text-center"
		}
	},
	clickSquare: function(a){
		if (this.state.classNames.indexOf('closed') !== -1) {
			return false
		}
		this.setState({
			marker: this.props.user.marker,
			classNames: "col-sm-4 space closedSquare text-center"
		});
		this.props.scoreboard(a);
	},
	render: function(){
		return(
				<div className={this.state.classNames} onClick={this.clickSquare.bind(null, this.props.value)}>
					<div className="gameMarker">{this.state.marker}</div>
				</div>
			)
	}
});

module.exports = Square;