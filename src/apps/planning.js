var React = require('react');
var ReactDOM = require('react-dom');

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