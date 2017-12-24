var React = require('react');

var Result = require('./Result');
var Settings = require('./Settings');
var Votes = require('./Votes');
var VotingCards = require('./VotingCards');

require('./css/App.scss');

var STAGES = {
    ERROR: 0,
    VOTING: 1,
    FLIPPED: 2
}

class App extends React.Component{
	constructor(props) {
		super(props);

		var view = this;
		this.state = {
			selection: null,
			users: [],
			connected: false,
			room: localStorage.getItem('room') || "",
			name: localStorage.getItem('name') || "Name",
			vote: "",
			roomData: {
				options: "",
				stage: 1,
				autoFlip: false
			},
		};

		this.onRoomChange = this.onRoomChange.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
		this.onVoteSelect = this.onVoteSelect.bind(this);
		this.onOptionsChange = this.onOptionsChange.bind(this);

		this.flip = this.flip.bind(this);
		this.toggleAutoFlip = this.toggleAutoFlip.bind(this);
		this.reset = this.reset.bind(this);

		this.props.socket.on('connect', function(data){
			console.debug("[i] Socket connected");
			view.setState({connected: true});
			if(view.state.room){
				view.onRoomChange(view.state.room);
			}
			view.onNameChange(view.state.name);
		});

		this.props.socket.on('disconnect', function(data){
			console.debug("[i] Socket disconnected");
			view.setState({connected: false});
		})

		this.props.socket.on('update', function(data){
			console.debug("[i] Update: ",data)
			view.setState(data);
		});

		this.props.socket.on('log', function(data){
			console.debug(data)
		});
	}

	emit(type,data){
		var contents = {
			type: type,
			data: data
		}

		this.props.socket.emit("action", contents);
	}

	onVoteSelect(vote){
		if(this.state.roomData.stage == STAGES.VOTING){
			this.setState({vote:vote});
			this.emit("vote", vote);
		}
	}

	onRoomChange(room){
		this.setState({room:room});
		localStorage.setItem("room", room);
		this.emit("room", room);
	}

	onNameChange(name){
		this.setState({name:name});
		localStorage.setItem('name', name);
		this.emit("name", name);
	}

	onOptionsChange(options){
		this.setState({roomData:{options:options,stage:this.state.roomData.stage}});
		this.emit("options", options);
	}

	flip(){
		this.emit("flip");
	}

	toggleAutoFlip(){
		this.emit("autoFlip");
	}

	reset(){
		this.emit("reset");
	}

	render(){
		return (
			<div className="App">
				<div className="public">
					<div className="displayed">
						<Settings
							onRoomChange={this.onRoomChange}
							onNameChange={this.onNameChange}
							onOptionsChange={this.onOptionsChange}
							room={this.state.room}
							name={this.state.name}
							options={this.state.roomData.options}
						/>
						<Votes users={this.state.users} stage={this.state.roomData.stage}/>
					</div>
					<div className="sidebar">
						<div className={"status "+(this.state.connected?"con":"")} />
						{this.state.room?(
							<div>
								<button onClick={this.flip}>FLIP</button>
								<div className="checkbox">
									<input type="checkbox" id="autoFlipCheckbox" checked={this.state.roomData.autoFlip} onChange={this.toggleAutoFlip}/>
									<label htmlFor="autoFlipCheckbox">Auto</label>
								</div>
								<button onClick={this.reset}>RESET</button>
							</div>
						):""}
					</div>
				</div>
				<VotingCards
					onVoteSelect={this.onVoteSelect}
					vote={this.state.vote}
					options={this.state.roomData.options}
				/>
			</div>
		)
	}
};

module.exports = App;