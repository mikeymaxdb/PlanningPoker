const React = require('react')
const Card = require('./Card')
require('./css/VotingCards.scss')

class VotingCards extends React.Component {
    onClick(item) {
        console.debug('Vote selected: ', item)
        this.props.onVoteSelect(item)
    }

    render() {
        const view = this

        if (!this.props.options) {
            return <div />
        }

        return (
            <div className="VotingCards">
                {this.props.options.split(',').map((item, index) => (
                    <Card
                        value={item}
                        onClick={view.onClick.bind(view, item)}
                        selected={view.props.vote === item}
                        key={index}
                    />
                ))}
            </div>
        )
    }
}

module.exports = VotingCards
