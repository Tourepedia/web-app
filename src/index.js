import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import createStore from './store/createStore'
import registerServiceWorker from './registerServiceWorker';

// Store Initialization
// ------------------------------------
const store = createStore(window.__INITIAL_STATE__)


// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

ReactDOM.render(<App store={store} />, MOUNT_NODE);
registerServiceWorker();
