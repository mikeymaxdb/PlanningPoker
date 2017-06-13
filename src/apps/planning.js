var React = require('react');
var ReactDOM = require('react-dom');
var io = require('socket.io-client');
var socket = io();

class App extends React.Component{
	render(){
		return (
			<div>
				Planning poker in react
			</div>
		)
	}
};

ReactDOM.render(<App />, document.getElementById("AppContainer"));