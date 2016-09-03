// Include Server Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

//Mongoose Models
var User = require('./models/User');
var Room = require('./models/Room');

// Create Instance of Express
var PORT = process.env.PORT || 4000; // Sets an initial port.

// Run Morgan for Logging
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));

// MongoDB Configuration configuration
mongoose.connect('mongodb://localhost:27017/randomRooms');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', function (err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function () {
  console.log('Mongoose connection successful.');
});

//Routes
app.get('/', function (req, res) {
	console.log('requested')
  res.sendFile(path.join(__dirname, 'public', '/index.html'));
});

//Turn on Server
server.listen(process.env.PORT || 4000, function(){
	console.log('Listening on', PORT);
});


//Socket.io
io.on('connection', function (socket) {
	console.log('connected to socket.io!')

	var globalUser, globalRoom;

	//Either creates a new user or will send back the user with a matching name
	socket.on('new user', function(userSubmit){
		User.findOne({name: userSubmit.name}).exec(function(err, user){
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
	socket.on('send message', function(payload){
		console.log(payload)
		Room.findOne({_id: payload.room}).exec(function(err, room){
			console.log('room is', room)
			room.messages.push({
				message: payload.message,
				user: payload.user
			});
			room.save(function(){
				io.to(payload.room).emit('messages updated', payload);
			});
		});
	});
	socket.on('close down room - relay', function(){
		socket.leave(globalRoom._id);
	});
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






