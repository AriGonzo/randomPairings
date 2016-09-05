// Include Server Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var server = require('http').Server(app);
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

//Socket.io
require('./sockets/listeners')(server);

//Turn on Server
server.listen(process.env.PORT || 4000, function(){
	console.log('Listening on', PORT);
});