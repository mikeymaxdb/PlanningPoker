const STAGES = {
	ERROR: 0,
	VOTING: 1,
	FLIPPED: 2
}

class Room{
	constructor(name,io){
		this._name = name;
		this._options = "0,1,2,3,5,8,13,20,40,60,100";
		this._stage = 1;
		this._autoFlip = false;
		this._reset = false;

		this.io = io;
	}

	// Class props
	get name(){
		return this._name;
	}

	get options(){
		return this._options;
	}

	set options(options){
		this._options = options;
	}

	get stage(){
		return this._stage;
	}

	set stage(stage){
		this._stage = stage;
	}

	get autoFlip(){
		return this._autoFlip;
	}

	set autoFlip(autoFlip){
		this._autoFlip = autoFlip;
	}


	// Generated props
	get data(){
		return {
			name: this.name,
			options: this.options,
			stage: this.stage,
			autoFlip: this.autoFlip,
			reset: this._reset
		}
	}

	get canVote(){
		return this.stage == STAGES.VOTING;
	}


	// Actions
	flip(){
		this.stage = STAGES.FLIPPED;
	}

	toggleAutoFlip(){
		this.autoFlip = !this.autoFlip;
	}

	reset(){
		this.stage = STAGES.VOTING;
		this._reset = true;
	}

	sync(){
		// Update clients
		var clients = this.io.sockets.adapter.rooms[this.name];
		if(!clients){
			return;
		}

		var DB = {
			users: [],
			room: this.name,
			roomData: this.data
		}

	    var haveAllVotes = true;

		for(var id in clients.sockets) {
			var sock = this.io.sockets.sockets[id];
			if(this._reset){
				sock.vote = "";
				sock.emit('update',{vote:sock.vote});
			}

			var user = {};
			user.name = sock.name;
			user.vote = sock.vote;

			DB.users.push(user);

	        haveAllVotes = haveAllVotes && !!(sock.vote);
		};

		this.io.to(this.name).emit('update', DB);
		this._reset = false;

	    // Autoflip
	    if(this.autoFlip && haveAllVotes && this.canVote){
	        this.flip();
	        this.sync();
	    }
	}
}

module.exports = Room;