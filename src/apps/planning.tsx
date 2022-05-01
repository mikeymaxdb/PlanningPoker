import React from 'react'
import ReactDOM from 'react-dom'
import { io } from 'socket.io-client'

import App from 'components/App'

const socket = io('/planningSocket')

ReactDOM.render(
    <App socket={socket} />,
    document.getElementById('AppContainer'),
)
