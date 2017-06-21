var React = require('react');

require('./css/Settings.scss');

class Settings extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			room: "",
			name: "",
			options: "",
			showOptions: false
		};
		this.updateRoom = this.updateRoom.bind(this);
		this.updateName = this.updateName.bind(this);
		this.updateOptions = this.updateOptions.bind(this);
		this.showOptions = this.showOptions.bind(this);
	}

	updateRoom(e){
		this.setState({room: e.target.value});
		this.props.onRoomChange(e.target.value);
	}

	updateName(e){
		this.setState({name: e.target.value});
		this.props.onNameChange(e.target.value);
	}

	updateOptions(e){
		this.setState({options: e.target.value});
		this.props.onOptionsChange(e.target.value);
	}

	showOptions(){
		this.setState({showOptions:!this.state.showOptions});
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps);
	}

	render(){
		return (
			<div className="Settings">
				<div className="items">
					<div className="inputItem">
						<div className="label">Room</div>
						<div>
							<input type="text" className={this.state.room?"":"toFill"} value={this.state.room} onChange={this.updateRoom} />
						</div>
					</div>
					<div className="inputItem">
						<div className="label">Name</div>
						<div>
							<input type="text" value={this.state.name} onChange={this.updateName} />
						</div>
					</div>
					{this.state.options?(
						<div className="inputItem">
							<div className="label">Options <span onClick={this.showOptions}>{this.state.showOptions?"Hide":"Edit"}</span></div>
							<div className={this.state.showOptions?"":"hidden"}>
								<input type="text" value={this.state.options} onChange={this.updateOptions} />
							</div>
						</div>
					):""}
				</div>
			</div>
		)
	}
};

module.exports = Settings;