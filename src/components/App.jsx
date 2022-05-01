import React from 'react'

import Settings from 'components/Settings'
import Votes from 'components/Votes'
import VotingCards from 'components/VotingCards'

import './css/App.scss'

const STAGES = {
    ERROR: 0,
    VOTING: 1,
    FLIPPED: 2,
}

// returns the first integer found in the string
const stringToInt = function (str) {
    const r = /\d+/g
    let num = NaN
    if (str) {
        const nums = str ? str.match(r) : null
        if (nums) {
            // at least one number has been found
            num = Number(nums[0])
        }
    }

    return num
}

const calcAvg = function (options, users) {
    let validVotes = 0
    const total = users.reduce((a, c) => {
        // a vote is considered valid when it has a number in it
        const num = stringToInt(c.vote)
        if (Number.isNaN(num)) {
            return a
        }
        validVotes += 1
        return a + num
    }, 0)

    const avg = total / validVotes

    // find the closest option
    let dist = Number.MAX_SAFE_INTEGER
    let bestMatch = 0

    options.split(',').forEach((val) => {
        const num = stringToInt(val)
        if (!Number.isNaN(num)) {
            const newDist = Math.abs(avg - num)
            if (newDist < dist) {
                dist = newDist
                bestMatch = num
            } else if (newDist === dist && num > bestMatch) {
                // favor the largest number
                bestMatch = num
            }
        }
    })

    return bestMatch
}

class App extends React.Component {
    constructor(props) {
        super(props)

        const hash = window.location.hash.replace('#', '')
        const roomName = hash || localStorage.getItem('room') || ''

        this.state = {
            users: [],
            connected: false,
            room: roomName,
            name: localStorage.getItem('name') || 'Name',
            vote: '',
            options: '',
            stage: 1,
            autoFlip: false,
        }

        this.onRoomChange = this.onRoomChange.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.onVoteSelect = this.onVoteSelect.bind(this)
        this.onOptionsChange = this.onOptionsChange.bind(this)

        this.flip = this.flip.bind(this)
        this.toggleAutoFlip = this.toggleAutoFlip.bind(this)
        this.reset = this.reset.bind(this)

        const { socket } = props
        const { room, name } = this.state

        socket.on('connect', () => {
            console.debug('[i] Socket connected')
            this.setState({ connected: true })
            if (room) {
                this.onRoomChange(room)
            }
            this.onNameChange(name)
        })

        socket.on('disconnect', () => {
            console.debug('[i] Socket disconnected')
            this.setState({ connected: false })
        })

        socket.on('update', (data) => {
            console.debug('[i] Update: ', data)
            this.setState(data)
        })

        socket.on('log', (data) => {
            console.debug(data)
        })
    }

    emit(type, data) {
        const contents = {
            type,
            data,
        }

        const { socket } = this.props
        socket.emit('action', contents)
    }

    onVoteSelect(vote) {
        const { stage } = this.state
        if (stage === STAGES.VOTING) {
            this.setState({ vote })
            this.emit('vote', vote)
        }
    }

    onRoomChange(room) {
        this.setState({ room })
        window.location.hash = room
        localStorage.setItem('room', room)
        this.emit('room', room)
    }

    onNameChange(name) {
        this.setState({ name })
        localStorage.setItem('name', name)
        this.emit('name', name)
    }

    onOptionsChange(options) {
        this.setState({ options })
        this.emit('options', options)
    }

    flip() {
        this.emit('flip')
    }

    toggleAutoFlip() {
        this.emit('autoFlip')
    }

    reset() {
        this.emit('reset')
    }

    render() {
        const {
            stage,
            options,
            users,
            vote,
            room,
            name,
            connected,
            autoFlip,
        } = this.state

        return (
            <div className="App">
                <div className="public">
                    <div className="displayed">
                        <Settings
                            onRoomChange={this.onRoomChange}
                            onNameChange={this.onNameChange}
                            onOptionsChange={this.onOptionsChange}
                            room={room}
                            name={name}
                            options={options}
                        />

                        <Votes users={users} stage={stage} />
                        {stage === 2 ? <div className="avg">{`Avg: ${calcAvg(options, users)}`}</div> : null}
                    </div>
                    <div className="sidebar">
                        <div className={`status ${connected ? 'con' : ''}`} />
                        {room ? (
                            <div>
                                <button type="submit" onClick={this.flip}>FLIP</button>
                                <div className="checkbox">
                                    <input type="checkbox" id="autoFlipCheckbox" checked={autoFlip} onChange={this.toggleAutoFlip} />
                                    <label htmlFor="autoFlipCheckbox">Auto</label>
                                </div>
                                <button type="button" onClick={this.reset}>RESET</button>
                            </div>
                        ) : ''}
                    </div>
                </div>
                <VotingCards
                    onVoteSelect={this.onVoteSelect}
                    vote={vote}
                    options={options}
                />
            </div>
        )
    }
}

export default App
