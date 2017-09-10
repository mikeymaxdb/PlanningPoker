var React = require('react');
var ReactDOM = require('react-dom');
var io = require('socket.io-client');
var socket = io.connect({path: '/planning/socket.io'});

var App = require('../components/App');

ReactDOM.render(<App socket={socket}/>, document.getElementById("AppContainer"));