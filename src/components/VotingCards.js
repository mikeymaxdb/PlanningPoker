var React = require('react');
var Card = require('./Card');
require('./css/VotingCards.scss');

var cards = [1,3,5,8,13,21,34];

class VotingCards extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			selection: null
		};
	}

	onClick(item){
		console.debug("Vote selected: ",item);
		this.setState({selection:item});
		this.props.onVoteSelect(item);
	}

	render(){
		var view = this;

		return (
			<div className="VotingCards">
				{cards.map(function(item,index){
					return (
						<Card
							value={item}
							onClick={view.onClick.bind(view,item)}
							selected={view.state.selection == item}
							key={index}
						/>
					)
				})}
			</div>
		)
	}
};

module.exports = VotingCards;