var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
	players: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	isOpen: Boolean,
	messages: [ {
		message: String,
		user: Object
	} ]
});

module.exports = mongoose.model('Room', RoomSchema);