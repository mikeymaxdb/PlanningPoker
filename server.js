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

    socket.on("action", function(payload){
        var type = payload.type;
        var data = payload.data;

        // These control their own sync
        var performSync = (type != "room" && type != "reset");

        var log = "[+] "+socket.name+"["+(getRoomName(socket))+"] ";

        // Make sure we have a room if we need one
        if(type != "room" && !socket.room){
            socket.emit('log', "[=][" + type + "] No room defined");
            return;
        }

        switch (type){
            case "room":
                log += "joined " + data;

                socket.leave(getRoomName(socket));
        
                if(!Rooms[data]){
                    Rooms[data] = new Room(data,io);
                }

                socket.room = Rooms[data];

                socket.join(data,function(){
                    socket.room.sync();
                });

                break;
            case "name":
                log += "is now " + data;
                socket.name = data;
                break;
            case "vote":
                if(socket.room.canVote){
                    log += "votes " + data;
                    socket.vote = data;
                }
                break;
            case "options":
                log += "changed options";
                socket.room.options = data;
                break;
            case "flip":
                log += "flipped";
                socket.room.flip();
                break;
            case "autoFlip":
                log += "toggled autoFlip";
                socket.room.toggleAutoFlip();
                break;
            case "reset":
                log += "reset";
                socket.room.reset();
                break;
        }

        console.log(log);

        if(performSync){
            socket.room.sync();
        }
    });

    socket.on('disconnect', function() {
    	console.log('[-] '+socket.name+'['+(getRoomName(socket))+'] disconnected');
        if(socket.room){
            socket.room.sync();
        }
	});
});