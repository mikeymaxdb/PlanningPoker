var React = require('react');

var Result = require('./Result');
var Settings = require('./Settings');
var Votes = require('./Votes');
var VotingCards = require('./VotingCards');

require('./css/App.scss');

var stages = [
	"err",
	"voting",
	"flipped"
];

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
				stage: 1
			},
		};

		this.onRoomChange = this.onRoomChange.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
		this.onVoteSelect = this.onVoteSelect.bind(this);
		this.onOptionsChange = this.onOptionsChange.bind(this);

		this.flip = this.flip.bind(this);
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
			if(data.name){
				localStorage.setItem('name', data.name);
			}
			if(data.room){
				localStorage.setItem('room', data.room);
			}
		});

		this.props.socket.on('log', function(data){
			console.debug(data)
		});
	}

	onVoteSelect(vote){
		this.setState({vote:vote});
		this.props.socket.emit('vote', vote);
	}

	onRoomChange(room){
		this.setState({room:room});
		this.props.socket.emit('room', room);
	}

	onNameChange(name){
		this.setState({name:name});
		this.props.socket.emit('name', name);
	}

	onOptionsChange(options){
		this.setState({options:options});
		this.props.socket.emit('options', options);
	}

	flip(){
		this.props.socket.emit('flip');
	}

	reset(){
		this.props.socket.emit('reset');
	}

	render(){
		return (
			<div className="App">
				<div className="votingContainer">
					<Settings
						onRoomChange={this.onRoomChange}
						onNameChange={this.onNameChange}
						onOptionsChange={this.onOptionsChange}
						room={this.state.room}
						name={this.state.name}
						options={this.state.roomData.options}
					/>
					<Votes users={this.state.users} stage={this.state.roomData.stage}/>
					<VotingCards
						onVoteSelect={this.onVoteSelect}
						vote={this.state.vote}
						options={this.state.roomData.options}
					/>
				</div>
				<div className="sidebar">
					<div className={"status "+(this.state.connected?"con":"")} />
					{this.state.room?(
						<div>
							<button onClick={this.flip}>FLIP</button>
							<button onClick={this.reset}>RESET</button>
						</div>
					):""}
				</div>
			</div>
		)
	}
};

module.exports = App;