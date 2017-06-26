var express = require('express');
var App = express();
var Router = express.Router();

var RoomOptions = {};

App.use(express.static('public'));

var Server = App.listen(3000, function () {
  console.log('[i] Listening on port 3000');
});

function sync(socket){
	var clients = io.sockets.adapter.rooms[socket.room];
	if(!clients){
		return;
	}
	//console.log('[i] '+socket.name+'['+(socket.room||"")+'] caused sync');
	var DB = {
		users: [],
		room: socket.room,
		roomData: RoomOptions[socket.room]
	}

	for(id in clients.sockets) {
		var sock = io.sockets.sockets[id];
		if(RoomOptions[socket.room].reset){
			sock.vote = "";
			sock.emit('update',{vote:sock.vote});
		}
		var user = {};
		user.name = sock.name;
		user.vote = sock.vote;

		DB.users.push(user);
	};

	socket.emit('update',{name:socket.name,vote:socket.vote});
	io.to(socket.room).emit('update', DB);
	RoomOptions[socket.room].reset = false;
}

var io = require('socket.io')(Server);
io.on('connection', (socket)=>{
	console.log('[+] A user connected');
	socket.name = "User";

	socket.on('room', function(room) {
		console.log('[+] '+socket.name+'['+(socket.room||"")+'] joined '+room);
		socket.leave(socket.room);
		//TODO delete old room options if empty
		socket.room = room;
		if(!RoomOptions[room]){
			RoomOptions[room] = {options: "0,1,2,3,5,8,13,20,40,60,100",stage:1};
		}
        socket.join(room,function(){
        	sync(socket);
        });
    });

    socket.on('name', function(name) {
		console.log('[+] '+socket.name+'['+(socket.room||"")+'] is now '+name);
        socket.name = name;
        if(socket.room){
        	sync(socket);
        } else {
        	socket.emit('log', "[=][Name] No room defined");
        }
    });

    socket.on('vote', function(vote) {
        if(socket.room){
        	if(RoomOptions[socket.room].stage != 2){
        		console.log('[+] '+socket.name+'['+socket.room+'] votes '+vote);
	        	socket.vote = vote;
	        }
        	sync(socket);
        } else {
        	socket.emit('log', "[!][Vote] No room defined");
        }
    });

    socket.on('options', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+socket.room+'] changed options');
        	RoomOptions[socket.room].options = options;
        	sync(socket);
        } else {
        	socket.emit('log', "[!][Options] No room defined");
        }
    });

    socket.on('flip', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+socket.room+'] flipped');
        	RoomOptions[socket.room].stage = 2;
        	sync(socket);
        } else {
        	socket.emit('log', "[!][Flip] No room defined");
        }
    });

    socket.on('reset', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+socket.room+'] reset');
        	RoomOptions[socket.room].stage = 1;
        	RoomOptions[socket.room].reset = true;
        	sync(socket);
        } else {
        	socket.emit('log', "[!][Reset] No room defined");
        }
    });

    socket.on('disconnect', function() {
    	console.log('[-] '+socket.name+'['+(socket.room||"")+'] disconnected');
		sync(socket);
	});
});