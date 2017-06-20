var express = require('express');
var App = express();
var Router = express.Router();

var DB = {
}

App.use(express.static('public'));

var Server = App.listen(3000, function () {
  console.log('[i] Listening on port 3000');
});

function updateClients(socket){
	var clients = io.sockets.adapter.rooms[socket.room];
	var DB = {
		users: [],
		room: socket.room
	}

	for(id in clients.sockets) {
		var sock = io.sockets.sockets[id];
		var user = {};
		user.name = sock.name;
		user.vote = sock.vote;

		DB.users.push(user);
	};

	io.to(socket.room).emit('update', DB);
}

var io = require('socket.io')(Server);
io.on('connection', (socket)=>{
	console.log('[+] A user connected');
	socket.name = "User";

	socket.on('room', function(room) {
		console.log('[+] '+socket.name+' joined '+room);
		socket.leave(socket.room);
		socket.room = room;
        socket.join(room,function(){
        	updateClients(socket);
        });

        
    });

    socket.on('name', function(name) {
		console.log('[+] '+socket.name+' is now '+name);
        socket.name = name;
        if(socket.room){
        	updateClients(socket);
        	socket.emit('name',socket.name);
        } else {
        	socket.emit('log', "[!] No room defined");
        }
    });

    socket.on('vote', function(vote) {
		console.log('[+] '+socket.name+' votes '+vote);
        socket.vote = vote;
        if(socket.room){
        	updateClients(socket);
        } else {
        	socket.emit('log', "[!] No room defined");
        }
    });
});