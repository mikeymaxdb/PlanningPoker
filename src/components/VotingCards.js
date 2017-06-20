var React = require('react');
var Card = require('./Card');
require('./css/VotingCards.scss');

class VotingCards extends React.Component{
	onClick(item){
		console.debug("Vote selected: ",item);
		this.props.onVoteSelect(item);
	}

	render(){
		var view = this;

		return (
			<div className="VotingCards">
				{this.props.options.split(',').map(function(item,index){
					return (
						<Card
							value={item}
							onClick={view.onClick.bind(view,item)}
							selected={view.props.vote === item}
							key={index}
						/>
					)
				})}
			</div>
		)
	}
};

module.exports = VotingCards;