var React = require('react');

require('./css/Settings.scss');

class Settings extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			room: "",
			name: ""
		};
		this.updateRoom = this.updateRoom.bind(this);
		this.updateName = this.updateName.bind(this);
	}

	updateRoom(e){
		this.setState({room: e.target.value});
		this.props.onRoomChange(e.target.value);
	}

	updateName(e){
		this.setState({name: e.target.value});
		this.props.onNameChange(e.target.value);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({name:nextProps.name, room:nextProps.room});
	}

	render(){
		return (
			<div className="Settings">
				<div className="items">
					<div className="inputItem">
						<div className="label">Room</div>
						<div>
							<input type="text" value={this.state.room} onChange={this.updateRoom} />
						</div>
					</div>
					<div className="inputItem">
						<div className="label">Name</div>
						<div>
							<input type="text" value={this.state.name} onChange={this.updateName} />
						</div>
					</div>
				</div>
			</div>
		)
	}
};

module.exports = Settings;