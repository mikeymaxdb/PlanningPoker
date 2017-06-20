var React = require('react');
require('./css/Card.scss');

class Card extends React.Component{
	render(){
		var selected = this.props.selected?" selected":"";
		var stage = this.props.stage?" stage"+this.props.stage:"";
		var valid = this.props.value?" valid":"";

		return (
			<div className={"Card"+selected+stage+valid}>
				<div className="inner" onClick={this.props.onClick}>
					<div className="value">{this.props.value}</div>
					<div className="name">{this.props.name}</div>
				</div>

			</div>
		)
	}
};

module.exports = Card;