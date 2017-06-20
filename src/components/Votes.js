var React = require('react');
var Card = require('./Card');
require('./css/Votes.scss');

class Votes extends React.Component{
	render(){
		return (
			<div className="Votes">
				{this.props.users.map(function(user, index){
					return (
						<Card name={user.name} value={user.vote} key={index}/>
					);
				})}
			</div>
		)
	}
};

module.exports = Votes;