var express = require('express');
var App = express();
var Router = express.Router();

var Room = require('./Room.js');

var Rooms = {};

App.use(express.static('public'));

var Server = App.listen(3000, function () {
  console.log('[i] Listening on port 3000');
});

var io = require('socket.io')(Server,{path: '/planningSocket'});
io.on('connection', (socket)=>{
	console.log('[+] A user connected');
	socket.name = "User";

	socket.on('room', function(room) {
		console.log('[+] '+socket.name+'['+(socket.room||"")+'] joined '+room);
		socket.leave(socket.room);
		//TODO delete old room options if empty
		socket.room = room;
		if(!Rooms[room]){
			Rooms[room] = new Room(room,io);
		}
        socket.join(room,function(){
        	Rooms[room].sync(socket);
        });
    });

    socket.on('name', function(name) {
		console.log('[+] '+socket.name+'['+(socket.room||"")+'] is now '+name);
        socket.name = name;
        if(socket.room){
        	Rooms[socket.room].sync(socket);
        } else {
        	socket.emit('log', "[=][Name] No room defined");
        }
    });

    socket.on('vote', function(vote) {
        if(socket.room){
        	if(Rooms[socket.room].canVote){
        		console.log('[+] '+socket.name+'['+socket.room+'] votes '+vote);
	        	socket.vote = vote;
	        }
        	Rooms[socket.room].sync(socket);
        } else {
        	socket.emit('log', "[!][Vote] No room defined");
        }
    });

    socket.on('options', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+socket.room+'] changed options');
        	Rooms[socket.room].options = options;
        	Rooms[socket.room].sync(socket);
        } else {
        	socket.emit('log', "[!][Options] No room defined");
        }
    });

    socket.on('flip', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+socket.room+'] flipped');
        	Rooms[socket.room].flip();
        	Rooms[socket.room].sync(socket);
        } else {
        	socket.emit('log', "[!][Flip] No room defined");
        }
    });

    socket.on('autoFlip', function(options) {
        if(socket.room){
            console.log('[+] '+socket.name+'['+socket.room+'] flipped');
            Rooms[socket.room].toggleAutoFlip();
            Rooms[socket.room].sync(socket);
        } else {
            socket.emit('log', "[!][AutoFlip] No room defined");
        }
    });

    socket.on('reset', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+socket.room+'] reset');
        	Rooms[socket.room].reset();
        	Rooms[socket.room].sync(socket);
        } else {
        	socket.emit('log', "[!][Reset] No room defined");
        }
    });

    socket.on('disconnect', function() {
    	console.log('[-] '+socket.name+'['+(socket.room||"")+'] disconnected');
		Rooms[socket.room].sync(socket);
	});
});