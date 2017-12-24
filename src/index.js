import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './App';
import createStore from './store/createStore'
import registerServiceWorker from './registerServiceWorker';
import Pusher from "pusher-js"

// Store Initialization
// ------------------------------------
const store = createStore(window.__INITIAL_STATE__)


// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

ReactDOM.render(<App store={store} />, MOUNT_NODE);
registerServiceWorker();

if (process.env.NODE_ENV === "development") {
  Pusher.logToConsole = true;
}

const socket = new Pusher("70c434a1dcdca20a23a1", {
  encrypted: true, // optional, defaults to false
  cluster: 'ap2', // optional, if `host` is present, it will override the `cluster` option.
});

var channel = socket.subscribe('my-channel');
channel.bind('App\\Events\\TaskAssignmentEvent', function(data) {
  alert(data.task);
});
