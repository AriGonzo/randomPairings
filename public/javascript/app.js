var socket = io.connect('http://localhost:4000/');
var userGlobal;

$('#submitName').on('click', function(){
	var userName = $('#userName');
	var imageLink = $('#imageLink');

	socket.emit('new user', {
		name: userName.val(),
		image: imageLink.val()
	});
});

$('#submitMessage').on('click', function(){
	socket.emit('send message', {
		message: $('#message').val(),
		room: roomNameGlobal,
		user: userGlobal
	})
});

$('#joinBtn').on('click', function(){
	socket.emit('join room', userGlobal)
});

socket.on('set user', function(user){
	console.log('setting user');
	userGlobal = user;
	setUserUI(userGlobal);
});

socket.on('joined room', function(payload){
	setChatUI(payload);
});

socket.on('close down room', function(roomId){
	socket.emit('close down room - relay');
	resetChatUI();
});

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
}

function resetChatUI(){
	$('#messagesContainer').addClass('hidden');
	$('#joinBtnContainer').removeClass('hidden');
	$('#messagesList').html("");
}

