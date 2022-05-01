const React = require('react')
require('./css/Card.scss')

class Card extends React.Component {
    render() {
        const selected = this.props.selected ? ' selected' : ''
        const stage = this.props.stage ? ` stage${this.props.stage}` : ''
        const valid = this.props.value ? ' valid' : ''

        return (
            <div className={`Card${selected}${stage}${valid}`}>
                <div className="inner" onClick={this.props.onClick}>
                    <div className="value">{this.props.value}</div>
                    <div className="name">{this.props.name}</div>
                </div>

            </div>
        )
    }
}

module.exports = Card
