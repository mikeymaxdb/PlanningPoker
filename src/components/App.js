var React = require('react');

var Result = require('./Result');
var Settings = require('./Settings');
var Votes = require('./Votes');
var VotingCards = require('./VotingCards');

require('./css/App.scss');

class App extends React.Component{
	constructor(props) {
		super(props);

		var view = this;
		this.state = {
			selection: null,
			users: [],
			connected: false,
			room: "WeVideo",
			name: "Name",
			vote: ""
		};

		this.onRoomChange = this.onRoomChange.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
		this.onVoteSelect = this.onVoteSelect.bind(this);

		this.props.socket.on('connect', function(data){
			console.debug("[i] Socket connected");
			view.setState({connected: true});
			view.onRoomChange(view.state.room);
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

	onVoteSelect(vote){
		this.props.socket.emit('vote', vote);
	}

	onRoomChange(room){
		this.props.socket.emit('room', room);
	}

	onNameChange(name){
		this.props.socket.emit('name', name);
	}

	render(){
		return (
			<div className="App">
				<div className="votingContainer">
					<Settings
						onRoomChange={this.onRoomChange}
						onNameChange={this.onNameChange}
						room={this.state.room}
						name={this.state.name}
					/>
					<Votes users={this.state.users} />
					<VotingCards
						onVoteSelect={this.onVoteSelect}
						vote={this.state.vote}
					/>
				</div>
				<div className="sidebar">
					<Result />
				</div>
			</div>
		)
	}
};

module.exports = App;