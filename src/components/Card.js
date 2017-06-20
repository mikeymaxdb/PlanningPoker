var React = require('react');
require('./css/Card.scss');

class Card extends React.Component{
	render(){
		var selected = this.props.selected?" selected":"";
		return (
			<div className={"Card"+selected}>
				<div className="inner" onClick={this.props.onClick}>
					<div className="value">{this.props.value}</div>
					<div className="name">{this.props.name}</div>
				</div>

			</div>
		)
	}
};

module.exports = Card;