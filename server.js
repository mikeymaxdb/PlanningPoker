var express = require('express');
var App = express();
var Router = express.Router();

App.use(express.static('public'));

App.get('/', function (req, res) {
  //res.send('Hello World!');
})

var Server = App.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var io = require('socket.io')(Server);

io.on('connection', (socket)=>{
	console.log('a user connected');
});