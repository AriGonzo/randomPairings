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

socket.on('user created', function(user){
	console.log('user created, setting now');
	userGlobal = user;
	setUserUI(userGlobal);
});

socket.on('user exists', function(user){
	console.log('user exists, setting now')
	userGlobal = user;
	setUserUI(userGlobal);
});

socket.on('joined room', function(payload){
	console.log('something')
	console.log(payload)
});

function setUserUI(userObj) {
	$('#userInputContainer').addClass('hidden');
	$('#joinBtn').removeClass('disabled')
	$('#setUserName').text(userObj.name);
	$('#setUserImg').attr('src', userObj.image);
}

function setChatUI() {

}

