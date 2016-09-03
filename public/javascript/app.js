//Connection to socket.io
var socket = io.connect('http://localhost:4000/');
//Some global variables... bad practice... fix this later
var userGlobal, roomNameGlobal;

/* Event Listeners */

//Submitting your name and image link to create a new user in the DB
$('#submitName').on('click', function(){
	var userName = $('#userName');
	var imageLink = $('#imageLink');

	socket.emit('new user', {
		name: userName.val(),
		image: imageLink.val()
	});
});

//Click listener to join a room
$('#joinBtn').on('click', function(){
	socket.emit('join room', userGlobal)
});

//Click listener to send message to other user
$('#submitMessage').on('click', function(){
	socket.emit('send message', {
		message: $('#message').val(),
		room: roomNameGlobal,
		user: userGlobal
	})
	$('#message').val("")
});

/* Web Sockets */

//Whether a user is created or found, this will set the current user
socket.on('set user', function(user){
	console.log('setting user');
	userGlobal = user;
	setUserUI(userGlobal);
});

//After joining a room, this will alter the UI with the function below
socket.on('joined room', function(payload){
	setChatUI(payload);
});

//updates messages container with new messages
socket.on('messages updated', function(payload){
	$('#messagesList').append('<li>'+ payload.user.name +': '+ payload.message +'</li>');
});

//On being left alone in the room, this will remove you from the room and reset the UI
socket.on('close down room', function(roomId){
	socket.emit('close down room - relay');
	resetChatUI();
});

/* UI Functions */

function setUserUI(userObj) {
	$('#userInputContainer').addClass('hidden');
	$('#joinBtn').removeClass('disabled')
	$('#setUserName').text(userObj.name);
	$('#setUserImg').attr('src', userObj.image);
}

function setChatUI(payload) {
	$('#messagesContainer').removeClass('hidden');
	$('#joinBtnContainer').addClass('hidden');
	if (payload.room.players.length == 1) {
		$('#messagesList').append('<li>Waiting on Another Person to Join...</li>');
	} else {
		$('#messagesList').html("");
		$('#messagesList').append('<li>Say Hi!</li>');
	}
	roomNameGlobal = payload.room._id;
}

function resetChatUI(){
	$('#messagesContainer').addClass('hidden');
	$('#joinBtnContainer').removeClass('hidden');
	$('#messagesList').html("");
	roomNameGlobal = "";
}

