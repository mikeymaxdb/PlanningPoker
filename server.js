//TODO delete old rooms if empty

var express = require('express');
var App = express();
var Router = express.Router();

var Room = require('./Room.js');

var Rooms = {};

App.use(express.static('public'));

var Server = App.listen(3000, function () {
  console.log('[i] Listening on port 3000');
});

function getRoomName(socket){
    if(socket.room){
        return socket.room.name;
    } else{
        return "";
    }
}

var io = require('socket.io')(Server,{path: '/planningSocket'});
io.on('connection', (socket)=>{
	console.log('[+] A user connected');
	socket.name = "User";

	socket.on('room', function(roomName) {
        console.log('[+] '+socket.name+'['+(getRoomName(socket))+'] joined '+roomName);
		socket.leave(getRoomName(socket));
		
		if(!Rooms[roomName]){
			Rooms[roomName] = new Room(roomName,io);
		}

        socket.room = Rooms[roomName];

        socket.join(roomName,function(){
        	socket.room.sync(socket);
        });
    });

    socket.on('name', function(name) {
		console.log('[+] '+socket.name+'['+(getRoomName(socket))+'] is now '+name);
        socket.name = name;
        if(socket.room){
        	socket.room.sync(socket);
        } else {
        	socket.emit('log', "[=][Name] No room defined");
        }
    });

    socket.on('vote', function(vote) {
        if(socket.room){
        	if(socket.room.canVote){
        		console.log('[+] '+socket.name+'['+getRoomName(socket)+'] votes '+vote);
	        	socket.vote = vote;
	        }
        	socket.room.sync(socket);
        } else {
        	socket.emit('log', "[!][Vote] No room defined");
        }
    });

    socket.on('options', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+getRoomName(socket)+'] changed options');
        	socket.room.options = options;
        	socket.room.sync(socket);
        } else {
        	socket.emit('log', "[!][Options] No room defined");
        }
    });

    socket.on('flip', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+getRoomName(socket)+'] flipped');
        	socket.room.flip();
        	socket.room.sync(socket);
        } else {
        	socket.emit('log', "[!][Flip] No room defined");
        }
    });

    socket.on('autoFlip', function(options) {
        if(socket.room){
            console.log('[+] '+socket.name+'['+getRoomName(socket)+'] flipped');
            socket.room.toggleAutoFlip();
            socket.room.sync(socket);
        } else {
            socket.emit('log', "[!][AutoFlip] No room defined");
        }
    });

    socket.on('reset', function(options) {
        if(socket.room){
        	console.log('[+] '+socket.name+'['+getRoomName(socket)+'] reset');
        	socket.room.reset();
        	socket.room.sync(socket);
        } else {
        	socket.emit('log', "[!][Reset] No room defined");
        }
    });

    socket.on('disconnect', function() {
    	console.log('[-] '+socket.name+'['+(getRoomName(socket))+'] disconnected');
		socket.room.sync(socket);
	});
});