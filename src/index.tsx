import React from 'react'
import { createRoot } from 'react-dom/client'
import { io } from 'socket.io-client'

import { App } from 'App'

const socket = io('/planningSocket')

const root = createRoot(document.getElementById('Root') as Element)

// root.render(<App socket={socket} />)
root.render(<App />)
