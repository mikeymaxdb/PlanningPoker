const React = require('react')
const Card = require('./Card')
require('./css/Votes.scss')

class Votes extends React.Component {
    render() {
        const view = this

        return (
            <div className="Votes">
                {this.props.users.map((user, index) => (
                    <Card
                        name={user.name}
                        value={user.vote}
                        stage={view.props.stage}
                        key={index}
                    />
                ))}
            </div>
        )
    }
}

module.exports = Votes
