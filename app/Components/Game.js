// Include React 
var React = require('react');

// Components
var Square = require('./Squares');

var Game = React.createClass({
	clickSquare: function(result){
		console.log(this.props.user)
	},
	checkScore: function(){

	},
	render: function(){
		var values = [];
		for (var i=0; i <= 8; i++) {
			values.push(i);
		}
		var that = this;
		return (
			<div id="gameBoard">
				<div className="row">
				{ values.map(function(result){
					return <Square key={result} scoreboard={that.clickSquare} value={result} user={that.props.user} />
				})}
				</div>
			</div>
			)
	}
});

module.exports = Game;
