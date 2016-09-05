//Mongoose Models
var User = require('../models/User');
var Room = require('../models/Room');

module.exports = function(server){
	var io = require('socket.io')(server);

	return io.on('connection', function (socket) {
		console.log('connected to socket.io!')

		var globalUser, globalRoom;

		//Either creates a new user or will send back the user with a matching name
		socket.on('new user', function(userSubmit){
			User.findOne({username: userSubmit.name}).exec(function(err, user){
				if (!user) {
					var oUser = new User({
						name: userSubmit.name,
						image: userSubmit.image
					});
					oUser.save(function(err, user){
						socket.emit('set user', user)
					});
				} else {
					socket.emit('set user', user);
				}
				globalUser = user;
			});
		});
		//Join room event - Will check for open rooms, if none exist a new room is created
		socket.on('join room', function(userObj){
			Room.findOne({isOpen: true}).populate('players').exec(function(err, room){
				//if there is no open room, room parameter == null
				if (room) {
					room.players.push(userObj._id);
					room.isOpen = false;
					room.save(function(err, room){
						confirmJoin(room, userObj);
					});
				} else {
					room = new Room({
						isOpen: true,
						players: [userObj._id]
					})
					room.save(function(err, room){
						if (err) throw err;
						confirmJoin(room, userObj);
					});
				}

				function confirmJoin(room, user){
					socket.join(room._id);
					io.to(room._id).emit('joined room', {room: room, user: user});
					globalRoom = room;
				}
			});	
		});
		//Receives message from client, adds it to Room model history and relays it to other connected clients
		socket.on('send message', function(payload){
			Room.findOne({_id: payload.room}).exec(function(err, room){
				room.messages.push({
					message: payload.message,
					user: payload.user
				});
				room.save(function(){
					io.to(payload.room).emit('messages updated', payload);
				});
			});
		});
		//Upon other user leaving the room, you will also leave
		socket.on('close down room - relay', function(){
			socket.leave(globalRoom._id);
		});
		//Handles leaving a room and deleting it from the database
		socket.on('disconnect', function(){
			if (globalRoom){
				leaveRoom();
			}
		});

		function leaveRoom(){
			Room.remove({_id: globalRoom._id}, function(){
				io.to(globalRoom._id).emit('close down room', globalRoom._id);
			});
		}
	});
}